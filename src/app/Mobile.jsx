const Mobile = () => {
  return <div id="app app-mobile">
    <div className="app-header">
      <span className="slogan" onClick={() => {
        window.open('https://www.lingyiwanwu.com/')
      }}>
        <img alt="logo" width="80" height="56" decoding="async" data-nimg="1" className="logo" style={{color:'transparent'}} src="../assets/icon.svg"></img>
      </span>
    </div>
    <div className="mobile-main">
      {/* <span className="mobile-logo" on-click={() => {
      window.open('https://www.lingyiwanwu.com/')
    }}>
      <img alt="logo" width="152" height="56" src={logo}></img>
    </span> */}
      <h1 className="mobile-h1">欢迎体验Yi-34B-Chat模型！</h1>
      <h2 className="mobile-h2">目前移动端版本尚未推出，请使用电脑访问网页</h2>
    </div>
  </div>
}

export default Mobile