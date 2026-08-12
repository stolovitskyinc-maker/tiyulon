function PageContainer({ children }) {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 1.5rem',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}

export default PageContainer;