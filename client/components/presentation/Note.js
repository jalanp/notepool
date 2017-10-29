import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from '../../styles.js'

class Note extends Component {
  constructor(props){
    super(props);
  }

  callDelete(){
    this.props.deleteNote(this.props.currentNote._id);
  }

  addCollaborator(){
    const updatedNote = {
      id: this.props.currentNote._id,
      title: this.props.currentNote.title,
      body: this.props.currentNote.body,
      colour: this.props.currentNote.colour,
      collaborators: this.props.currentNote.collaborators
    }
    let alreadyAdded = false;
    for(let i = 0; i < updatedNote.collaborators.length; i++){
      if(updatedNote.collaborators[i] === 'test@abcd.com'){
        alreadyAdded = true;
      }
    }
    if(!alreadyAdded){
      updatedNote.collaborators.push('test@abcd.com');
      this.props.updateNote(updatedNote);
    }
  }

  updateColour(event){
    if(this.props.currentNote.colour !== event.target.id){
      const updatedNote = {
        id: this.props.currentNote._id,
        title: this.props.currentNote.title,
        body: this.props.currentNote.body,
        colour: event.target.id,
        collaborators: this.props.currentNote.collaborators
      }
      this.props.updateNote(updatedNote);
    }
  }

  render(){
    return(
      <div style={Object.assign({}, styles.note.container, {background: this.props.currentNote.colour})}>
        <h2 style={styles.note.header}>
          <Link style={styles.note.title} to={`/notes/${this.props.currentNote._id}`}>{this.props.currentNote.title}</Link>
        </h2>
        <span style={styles.note.body}>{this.props.currentNote.body}</span><br />
        <div style={styles.note.bottomContainer}>
          <div style={{gridColumn: 'first-column / column-end', justifySelf: 'left'}}>
            <button id="yellow" style={Object.assign({}, styles.note.colourButton, {background: 'yellow'})} onClick={this.updateColour.bind(this)} className="btn"></button>
            <button id="lightgreen" style={Object.assign({}, styles.note.colourButton, {background: 'lightgreen'})} onClick={this.updateColour.bind(this)} className="btn"></button>
            <button id="lightskyblue" style={Object.assign({}, styles.note.colourButton, {background: 'lightskyblue'})} onClick={this.updateColour.bind(this)} className="btn"></button>
          </div>
          <div style={{alignSelf: 'center'}}>
            Collaborators: {this.props.currentNote.collaborators}
          </div>
          <button style={{justifySelf: 'left'}} onClick={this.addCollaborator.bind(this)} className="btn btn-primary">Add Collaborator</button>
          <div style={{justifySelf: 'right'}}>
            <button onClick={this.callDelete.bind(this)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Note
