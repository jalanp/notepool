import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Form, Grid, Icon, Input, Label, Modal, TextArea } from 'semantic-ui-react'

import * as actions from '../../redux/actions'

import EditCollaborators from './EditCollaborators'

class EditNote extends Component {
  constructor(props){
    super(props);

    this.state = {
      note: {
        id: '',
        title: '',
        body: '',
        colour: '',
        collaborators: []
      },
      open: false
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      note: nextProps.item
    });
  }

  handleInputChange = (event) => {
    let updatedNote = {...this.state.note};
    updatedNote[event.target.id] = event.target.value;
    this.setState({
      note: updatedNote
    });
  }

  updateColour = (event) => {
    let currentButton = event.currentTarget.id;
    let selectedButton = document.querySelectorAll('.colour-selected');
    if (selectedButton[0]){
      selectedButton[0].classList.remove('colour-selected');
    }
    document.getElementById(currentButton).classList.toggle('colour-selected');

    let elements = document.querySelectorAll('.' + this.state.note.colour);
    for (let i = 0; i < elements.length; i++){
      if (elements[i].classList.contains('modal')){
        elements[i].classList.remove(this.state.note.colour);
        elements[i].classList.add(currentButton);
      }
    }

    if(this.state.note.colour !== currentButton){
      this.setState({
        note: {...this.state.note, ...{colour: currentButton}}
      });
    }
  }

  removeCollaborator = (event) => {
    let note = {...this.state.note};
    note['collaborators'] = note['collaborators'].filter(email => email !== event.target.id);
    this.setState({
      note: note
    })

    this.props.removeCollaborator({id: this.state.note.id, email: event.target.id});
  }

  delete = () => {
    if (this.state.note.id){ // delete note if it has been created (no id if note wasn't added)
      this.props.deleteNote(this.state.note.id);
    }
    this.props.close();
  }

  close = () => {
    const note = this.state.note;
    if (note) { // undefined if closing on delete note button
      if (note.id) { // if this note already exists
        this.props.updateNote(note);
      } else { // if this is a new note it won't have an id
        this.props.addNote({note: note, id: this.props.user.id});
      }
    }
    this.props.close();
  }

  showCollab = () => {
    this.setState({
      open: true
    });
  }

  closeCollab = () => {
    this.setState({
      open: false,
    });
  }

  render(){
    const colours_1 = ['white', 'lightgreen', 'lightskyblue'];
    const colours_2 = ['lightcoral', 'yellow', 'rosybrown'];

    const colourList_1 = colours_1.map((colour, i) => {
      return(
        <Button key={i} circular icon='check' id={colour} className={this.state.note.colour === colour ? 'colour-selected' : ''} onClick={this.updateColour} />
      )
    })

    const colourList_2 = colours_2.map((colour, i) => {
      return(
        <Button key={i} circular icon='check' id={colour} className={this.state.note.colour === colour ? 'colour-selected' : ''} onClick={this.updateColour} />
      )
    })

    const collabList = (this.state.note !== undefined ?
      this.state.note.collaborators.map((collaborator, i) => {
        return(
          <Label key={i}>
            {collaborator} <Icon id={collaborator} name='delete' onClick={this.removeCollaborator} />
          </Label>
        )
      })
      : '')

    return(
      <Modal dimmer='inverted' open={this.props.open} onClose={this.close} className={this.props.item.colour}>
        <Modal.Header>
          <Input id='title' fluid placeholder='Title' defaultValue={this.props.item.title} onChange={this.handleInputChange} />
        </Modal.Header>
        <Modal.Content className='with-border'>
          <Modal.Description>
            <Form>
              <TextArea id='body' autoHeight defaultValue={this.props.item.body} onChange={this.handleInputChange} />
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Content>
          <Modal.Description>
            {collabList}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Grid columns='equal'>
            <Grid.Column textAlign='left'>
              <Dropdown floating button className='icon inverted green bottom left' icon='paint brush' pointing>
                <Dropdown.Menu>
                  <Dropdown.Item className='with-grid'>{colourList_1}</Dropdown.Item>
                  <Dropdown.Item className='with-grid'>{colourList_2}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button inverted color='green' icon='add user' onClick={this.showCollab} />
              <EditCollaborators open={this.state.open} close={this.closeCollab} />
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button inverted color='red' icon='trash' onClick={this.delete} />
            </Grid.Column>
          </Grid>
        </Modal.Actions>
      </Modal>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user
})

const dispatchToProps = (dispatch) => ({
  addNote: (params) => dispatch(actions.addNote(params)),
  updateNote: (params) => dispatch(actions.updateNote(params)),
  deleteNote: (params) => dispatch(actions.deleteNote(params)),
  removeCollaborator: (params) => dispatch(actions.removeCollaborator(params)),
})

export default connect(stateToProps, dispatchToProps)(EditNote)
