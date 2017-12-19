import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Grid, Icon, Input, Modal } from 'semantic-ui-react'

import * as actions from '../../redux/actions'
import { getNotesByTerm } from '../../redux/reducers'

import { Loading, Note } from '../presentation'
import EditNote from './EditNote'

class Notes extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: false
    }
  }

  // When the page loads ('/notes'), fetch all notes to display
  componentDidMount(){
    this.props.fetchNotes(this.props.user.email);
  }

  // Adds a new blank note with the user as a collaborator, then opens the modal to edit the note
  addNote = () => {
    const note = {
      type: 'text',
      title: '',
      body: '',
      listBody: [{text: '', checked: false}],
      colour: 'white',
      collaborators: [{
        email: this.props.user.email,
        type: 'Owner'
      }]
    };
    this.props.addNote(note)
    .then((response) => {
      this.show(response);
    });
  }

  // Opens the 'Edit Note' modal
  show = (note) => {
    this.props.setCurrentNote(note); // Sets the current note to show in the modal
    this.setState({
      open: true
    });
  }

  // Closes the 'Edit Note' modal
  close = () => {
    this.setState({
      open: false
    });
  }

  // Handles input changes to search box
  handleInputChange = (event) => {
    this.props.setSearchTerm(event.target.value.toLowerCase());
  }

  render(){
    // Creates a button to add notes
    const noteButton = <Button circular icon='plus' size='big' color='teal' className='right-aligned-button' onClick={this.addNote}></Button>

    // Creates a Grid Column item with each note
    const listItems = this.props.searchedNotes.map((note, i) => {
      return(
        <Grid.Column key={note.id} mobile={16} tablet={8} computer={5}>
          <Note show={this.show} currentNote={note} />
        </Grid.Column>
      )
    })

    return(
      <div>
        {this.props.loading ?
          <Loading />
          :
          <Container style={{marginTop: '2rem'}}>
            <Grid columns='equal' stackable style={{marginTop: '1rem'}}>
              <Grid.Row>
                <Grid.Column style={{padding: '14px 0px'}}>
                  <Input fluid icon='search' placeholder='Search...' onChange={this.handleInputChange}/>
                </Grid.Column>
                {/* <Grid.Column width={1} style={{padding: '15px'}}>
                  <Button icon='paint brush' size='medium' color='teal' />
                </Grid.Column>
                <Grid.Column width={1} style={{padding: '15px'}}>
                  <Button icon='paint brush' size='medium' color='teal' />
                </Grid.Column> */}
              </Grid.Row>
              <Grid.Row>
                {listItems}
              </Grid.Row>
              <Grid.Row>
                {noteButton}
              </Grid.Row>
            </Grid>
          </Container>
        }
        {(this.props.currentNote.id !== '') &&
          <EditNote item={this.props.currentNote} open={this.state.open} close={this.close} />
        }
      </div>
    )
  }
}

// Maps state objects to props
const stateToProps = (state) => ({
  notes: state.note.notes,
  currentNote: state.note.currentNote,
  user: state.user,
  loading: state.note.loading,
  searchedNotes: getNotesByTerm(state)
})

// Maps dispatch functions to props
const dispatchToProps = (dispatch) => ({
  fetchNotes: (params) => dispatch(actions.fetchNotes(params)),
  addNote: (params) => dispatch(actions.addNote(params)),
  setCurrentNote: (params) => dispatch(actions.setCurrentNote(params)),
  setSearchTerm: (params) => dispatch(actions.setSearchTerm(params))
})

// Connects state and dispatch functions to this component
export default connect(stateToProps, dispatchToProps)(Notes)
