import { init, send } from './client-ipc'
import React from 'react'
import ReactDOM from 'react-dom'

init()

const App = () => {
  const [result, setResult] = React.useState('')

  async function makeFactorial() {
    let response = await send('make-factorial', { num: 5 })
    setResult(response)
  }

  return (
    <div>
      Hello from React App Component.{' '}
      <button onClick={makeFactorial}>Click Me</button>
      Response: {result}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app_root'))
