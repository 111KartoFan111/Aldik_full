from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from datetime import datetime
import os
import shutil
from uuid import uuid4

from app.database import get_db
from app.auth.jwt import get_current_user
from app.auth.models import User
from app.courses.models import Course, Module, UserCourse, CourseStatus
from app.courses.schemas import (
    CourseResponse, UserCourseResponse, UserCourseCreate, 
    UserCourseUpdate, CourseCreate, CourseUpdate
)

router = APIRouter(
    prefix="/api/courses",
    tags=["Курсы"],
)

@router.post("/upload-image/{course_id}", response_model=CourseResponse)
async def upload_course_image(
    course_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Загрузка изображения для курса
    """
    # Проверяем, существует ли курс
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Курс не найден"
        )
    
    # Создаем директорию для изображений курсов, если ее нет
    images_dir = "static/images/courses"
    os.makedirs(images_dir, exist_ok=True)
    
    # Генерируем уникальное имя файла
    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid4()}.{file_extension}"
    file_path = f"{images_dir}/{filename}"
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Обновляем URL изображения курса
    course.image_url = f"/static/images/courses/{filename}"
    db.add(course)
    db.commit()
    db.refresh(course)
    
    return course

@router.get("/my-courses/{user_id}", response_model=List[UserCourseResponse])
def get_user_courses(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Получение списка курсов, на которые записан пользователь
    """
    # Join с таблицей курсов для получения полной информации
    user_courses = (
        db.query(UserCourse)
        .join(Course, UserCourse.course_id == Course.id)
        .filter(UserCourse.user_id == user_id)
        .all()
    )
    
    # Для каждой записи добавляем информацию о курсе
    for user_course in user_courses:
        user_course.course = db.query(Course).filter(Course.id == user_course.course_id).first()
    
    return user_courses

@router.get("", response_model=List[CourseResponse])
def get_all_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Получение списка всех курсов
    """
    courses = db.query(Course).all()
    return courses

@router.get("/{course_id}", response_model=CourseResponse)
def get_course_by_id(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Получение информации о курсе по ID
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Курс не найден"
        )
    
    # Получаем модули курса
    modules = db.query(Module).filter(Module.course_id == course_id).order_by(Module.order).all()
    
    # Добавляем модули к объекту курса
    course.modules = modules
    
    return course

@router.post("/enroll", response_model=UserCourseResponse)
def enroll_in_course(
    course_data: UserCourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Запись пользователя на курс
    """
    # Проверяем существование курса
    course = db.query(Course).filter(Course.id == course_data.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Курс не найден"
        )
    
    # Проверяем, не записан ли пользователь уже на этот курс
    existing_enrollment = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_data.course_id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы уже записаны на этот курс"
        )
    
    # Создаем запись о записи на курс
    new_enrollment = UserCourse(
        user_id=current_user.id,
        course_id=course_data.course_id,
        status=CourseStatus.IN_PROGRESS,
        progress=0,
        earned_xp=0
    )
    
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    
    # Добавляем информацию о курсе в ответ
    new_enrollment.course = course
    
    return new_enrollment

@router.get("/{course_id}/progress", response_model=UserCourseResponse)
def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Получение прогресса пользователя по курсу
    """
    # Проверяем существование курса
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Курс не найден"
        )
    
    # Находим запись о курсе пользователя
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not user_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Вы не записаны на этот курс"
        )
    
    return user_course

@router.put("/{course_id}/progress", response_model=UserCourseResponse)
def update_course_progress(
    course_id: int,
    progress_data: UserCourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Обновление прогресса пользователя по курсу
    """
    # Проверяем существование курса
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Курс не найден"
        )
    
    # Находим запись о курсе пользователя
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()
    
    if not user_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Вы не записаны на этот курс"
        )
    
    # Обновляем прогресс
    if progress_data.progress is not None:
        user_course.progress = progress_data.progress
    
    # Обновляем статус
    if progress_data.status is not None:
        user_course.status = progress_data.status
        
        # Если курс завершен, устанавливаем дату завершения
        # В функции update_course_progress добавить:
        if progress_data.status == CourseStatus.COMPLETED:
            # Всегда устанавливать прогресс 100% при завершении
            user_course.progress = 100
            user_course.completed_at = datetime.utcnow()
            user_course.earned_xp = course.xp_reward
            
            # Добавить XP пользователю
            current_user.xp += course.xp_reward
            db.add(current_user)
    
    db.commit()
    db.refresh(user_course)
    
    # Добавляем информацию о курсе в ответ
    user_course.course = course
    
    return user_course