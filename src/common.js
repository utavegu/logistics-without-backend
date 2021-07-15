function Status(loading, error, success) {
  const statusBarStyle = {
    backgroundColor: "black",
        position: "absolute",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "100px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
  }
  return (
    <>
      {(loading || success || error) && 
      <div style={statusBarStyle}>
        {loading && <p style={{color: "yellow"}}>Loading...</p>}
        {error && <p style={{color: "red"}}>Error!</p>}
        {success && <p style={{color: "green"}}>Success!</p>}
      </div>}
    </>
  )
}

export {Status};