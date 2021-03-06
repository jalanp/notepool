import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Checkbox, Divider, Label } from 'semantic-ui-react'

const Note = (props) => {
  // Array of labels for the current note's collaborators
  const owner = props.currentNote.collaborators.map((collaborator, i) => {
    if (collaborator.type === 'Owner'){
      return(
        <Label key={i} color='teal' image>
          {collaborator.type}
          <Label.Detail content={collaborator.email} />
        </Label>
      )
    }
  })

  // Calls prop function to open 'Edit Note' modal on clicking the note
  const show = () => {
    props.show(props.currentNote);
  }

  // Array of all unchecked list items
  const uncheckedItems = props.currentNote.listBody.map((item, i) => {
    if (!item.checked){
      return(
        <div key={i}>
          <Checkbox className='list-item' checked={item.checked} />
          <span className={'list-item ' + (item.checked ? 'checked' : '')}>{item.text}</span>
        </div>
      )
    }
  })

  // Array of all checked list items
  const checkedItems = props.currentNote.listBody.map((item, i) => {
    if (item.checked){
      return(
        <div key={i}>
          <Checkbox className='list-item' checked={item.checked} />
          <span className={'list-item ' + (item.checked ? 'checked' : '')}>{item.text}</span>
        </div>
      )
    }
  })

  // Whether or not every value in the unchecked item list is undefined (therefore no unchecked items)
  const isUncheckedItemsUndefined = uncheckedItems.every((value) => {
    return value === undefined;
  })

  // Whether or not every value in the checked item list is undefined (therefore no checked items)
  const isCheckedItemsUndefined = checkedItems.every((value) => {
    return value === undefined;
  })

  // Component that renders the list items
  const ListItems = () => {
    return(
      <div>
        {(!isUncheckedItemsUndefined) && uncheckedItems}
        {(!isCheckedItemsUndefined) && <Divider />}
        {(!isCheckedItemsUndefined) && checkedItems}
      </div>
    )
  }

  return(
    <Card centered onClick={show} className={props.currentNote.colour}>
      <Card.Content>
        <Card.Header content={props.currentNote.title} />
        <Card.Description className='note-card'>
          {props.currentNote.type === 'text' ?
          <span className='note-body'>{props.currentNote.body}</span>
          :
          <ListItems />}
        </Card.Description>
      </Card.Content>
      <Card.Content extra className='not mobile'>
        {owner}
      </Card.Content>
      <Label color='teal' corner='right'>{props.currentNote.collaborators.length}</Label>
    </Card>
  )
}

export default Note
