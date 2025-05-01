import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('3D компонент вызвал ошибку:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="itachi-container error">
        <div style={{textAlign: 'center', padding: '20px'}}>
          3D модель не может быть отображена
        </div>
      </div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;