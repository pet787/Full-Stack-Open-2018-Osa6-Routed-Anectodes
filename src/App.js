import React from 'react'
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'
import { Media} from 'react-bootstrap'

const Menu = () => {
  const unactiveStyle = {
    background: 'lightblue',
    color: 'black',
    display: 'block',
    textAlign: 'center',
    padding: 10,
    textDecoration: 'none',
   }

  const activeStyle = {
    fontWeight: 'bold',
    background: 'black',
    color: 'white',
    display: 'block',
    textAlign: 'center',
    padding: 10,
    textDecoration: 'none',
   }

   const ulStyle = {
    listStyleType: 'none',
    background: 'lightblue',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
   }

   const liStyle = {
    float: 'left',
   }
   
   return (
    <div>
    <ul style={ulStyle} > 
      <li style={liStyle} ><NavLink to="/anecdotes" style={unactiveStyle} activeStyle={activeStyle}>anecdotes</NavLink></li>
      <li style={liStyle} ><NavLink to="/createnew" style={unactiveStyle} activeStyle={activeStyle}>create new</NavLink></li>
      <li style={liStyle} ><NavLink to="/about" style={unactiveStyle} activeStyle={activeStyle}>about</NavLink></li>
     </ul>
     </div>
  )
}

const AnecdoteList = ({ anecdotes }) => {  
  return(
    <div>
      <h2>Anecdotes</h2>
      <ul class='list-group'>
        {anecdotes.map(anecdote => 
          <li class='list-group-item' key={anecdote.id} >
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>)}
      </ul>  
    </div>
  )
}

const Anecdote = ({ anecdote }) => {
  return(
    <div>
      <h2>{anecdote.content} </h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more information see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) return null
  const style={
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 5,
    marginBottom: 5
  }
  return(
    <div style={style}>
      <p>{message}</p>
    </div>
  )
}

const About = () => (
  <div>
    <Media>
      <Media.Body>
        <Media.Heading>About anecdote app</Media.Heading>
        <p>According to Wikipedia:</p>
        
        <em>An anecdote is a brief, revealing account of an individual person or an incident. 
          Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
          such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
          An anecdote is "a story with a point."</em>

        <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
      </Media.Body>
      <Media.Right>
        <img width={219} height={297} src="/thumbnail.png" alt="thumbnail" />
      </Media.Right>
    </Media>
   </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code. 
  </div>
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: ''
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.props.history.push('/')
    this.props.setNotification('A new anecdote \'' + this.state.content + '\' was created')
    setTimeout( () => {
      this.props.setNotification(null)
    }, 10000)
  }

  render() {
    return(
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            content 
            <input name='content' value={this.state.content} onChange={this.handleChange} />
          </div>
          <div>
            author
            <input name='author' value={this.state.author} onChange={this.handleChange} />
          </div>
          <div>
            url for more info
            <input name='info' value={this.state.info} onChange={this.handleChange} />
          </div> 
          <button>create</button>
        </form>
      </div>  
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: null
    } 
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote) })
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  setNotification = () => (notification) => {
    this.setState( { notification: notification })
  }

  render() {
    return (
      <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Route path="/" render={() => <Menu />} />  
        <Route path="/" render={() => <Notification message={this.state.notification} />} />  
        <Route exact path="/" 
          render = { () => { 
            return ( 
              <div>
                <AnecdoteList anecdotes={this.state.anecdotes}/> 
              </div>
            ) 
          } } 
        /> 
        <Route exact path="/anecdotes" 
          render = { () => { 
            return ( 
              <div>
                <AnecdoteList anecdotes={this.state.anecdotes}/> 
              </div>
            ) 
          } } 
        /> 
        <Route path="/createnew" 
          render = { ({history}) => { 
            return ( 
              <div>
                <CreateNew history={history} addNew={this.addNew} setNotification={this.setNotification()}/> 
              </div>
            ) 
          } } 
        /> 
        <Route path="/about" 
          render = { () => { 
            return ( 
              <div>
                <About/> 
              </div>
            ) 
          } } 
        /> 
        <Route exact path="/anecdotes/:id" 
          render = { ( { match } ) =>
          <Anecdote anecdote = { this.anecdoteById( match.params.id ) } /> }
        />
        <Route path="/" render={() => <Footer />} />  
      </div>
      </Router>
    );
  }
}

export default App;
