export const textBox: React.CSSProperties = {
    width: "100%",
    height: "600px",
    overflow: "scroll",
    border: "1px solid #bdbdbd",
    padding: "10px"
}

export const textBoxTall: React.CSSProperties = {
    ...textBox,
    height: "100%"
}

export const cover: React.CSSProperties = {
    width: "100%",
    position: "fixed",
    backgroundColor: "#efefef",
    color: "#000",
    fontFamily: "Roboto, Tahoma, Arial, sans-serif",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    fontSize: "x-large",
    fontWeight: "bold",
    zIndex: 10,
    left:0
}

export const fullScreen: React.CSSProperties = {
    position: "fixed",
    top: "50px",
    left: "0",
    bottom: "0",
    right: "0",
    zIndex: 5,
    background: "white",
    paddingTop: "5px",
}

export const mobileButtons: React.CSSProperties = {
    padding: "5px 0",
    background: "#bdbdbd",
    height: "50px",
    position: "fixed",
    width: "100%",
    zIndex: 5,
    display: "flex",
    alignItems: "center",
}

export const mobileButton: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 'small'
}


export const selector: React.CSSProperties = {
    paddingTop: "5px",
    paddingBottom: "5px",
}