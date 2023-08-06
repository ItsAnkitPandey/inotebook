import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const initialNotes = []

  const host = "http://localhost:5000";
  const [notes, setNotes] = useState(initialNotes);

  // Get All notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNTI0YzEwNjg3NDc1ZDdmZDFhZDYzIn0sImlhdCI6MTY4ODU3MTI4Mn0.b5wyl1H-h_vZ8SSn4u8zqLz3BZitG6mekxHf8Mb-97s"
      }
    });

    const json = await response.json();
    console.log(json);
    setNotes(json)
  }
  // Add a note
  const addNote = async (title, description, tag, id) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNTI0YzEwNjg3NDc1ZDdmZDFhZDYzIn0sImlhdCI6MTY4ODU3MTI4Mn0.b5wyl1H-h_vZ8SSn4u8zqLz3BZitG6mekxHf8Mb-97s"
      },
      body: JSON.stringify({ title, description, tag }),
    });
    

    const note = await response.json();
    setNotes(notes.concat(note))
  }

  // Delete a note

  const deleteNote = async (id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNTI0YzEwNjg3NDc1ZDdmZDFhZDYzIn0sImlhdCI6MTY4ODU3MTI4Mn0.b5wyl1H-h_vZ8SSn4u8zqLz3BZitG6mekxHf8Mb-97s"
      }
      
    });
    const json = response.json();
    console.log(json);
  
    console.log("deleteing the note" + id)
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes)


  }

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNTI0YzEwNjg3NDc1ZDdmZDFhZDYzIn0sImlhdCI6MTY4ODU3MTI4Mn0.b5wyl1H-h_vZ8SSn4u8zqLz3BZitG6mekxHf8Mb-97s"
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json)

    let newNotes = JSON.parse(JSON.stringify(notes));
    //logic for edit
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag; 
        break; 
      }
    }  
    setNotes(newNotes);

  }


  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, editNote, deleteNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;