import React, { useState, useEffect } from 'react';
import './style1.css';

const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState({ id: '', name: '', age: '', grade: '' });
  const [formErrors, setFormErrors] = useState({});
  const [enteredDetails, setEnteredDetails] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setStudentData({ ...studentData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let errors = {};

    if (!studentData.name.match(/^[A-Za-z]+$/)) {
      errors.name = 'Name should only contain alphabets';
    }

    if (!studentData.grade.match(/^[A-Za-z]+$/)) {
      errors.grade = 'Grade should only contain alphabets';
    }

    if (!studentData.age.match(/^[0-9]+$/)) {
      errors.age = 'Age should only contain numbers';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const addStudent = async () => {
    if (validateForm()) {
      let tempData = { ...studentData };
      delete tempData.id;  // Remove id from tempData
      try {
        const response = await fetch('http://localhost:5000/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tempData),
        });
        if (response.ok) {
          setStudents((prevStudents) => [...prevStudents, tempData]); // use tempData instead of data
          setEnteredDetails(`Name: ${tempData.name}, Age: ${tempData.age}, Grade: ${tempData.grade}`);
          setStudentData({ id: '', name: '', age: '', grade: '' });        
        } else {
          console.error('Response not OK', response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateStudent = async () => {
    if (validateForm()) {
      let tempData = { ...studentData };
      try {
        const response = await fetch(`http://localhost:5000/students/${tempData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tempData),
        });
        const data = await response.json();
        setStudents(students.map((student) => (student.id === data.id ? data : student)));
        setEnteredDetails(`Name: ${tempData.name}, Age: ${tempData.age}, Grade: ${tempData.grade}`);
        setStudentData({ id: '', name: '', age: '', grade: '' });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteStudent = async (id) => {
    try {
      await fetch(`http://localhost:5000/students/${id}`, {
        method: 'DELETE',
      });
      setStudents(students.filter((student) => student.id !== id));
      setEnteredDetails('');
      setStudentData({ id: '', name: '', age: '', grade: '' });
    } catch (error) {
      console.log(error);
    }
  };

  const getStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/students/${id}`);
      const data = await response.json();
      setStudentData(data);
      setEnteredDetails(`Name: ${data.name}, Age: ${data.age}, Grade: ${data.grade}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Student Hub</h1>
      <div className="form-container">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" name="name" value={studentData.name} onChange={handleInputChange} placeholder="Name" />
          {formErrors.name && <div className="error">{formErrors.name}</div>}
          <input type="text" name="age" value={studentData.age} onChange={handleInputChange} placeholder="Age" />
          {formErrors.age && <div className="error">{formErrors.age}</div>}
          <input type="text" name="grade" value={studentData.grade} onChange={handleInputChange} placeholder="Grade" />
          {formErrors.grade && <div className="error">{formErrors.grade}</div>}
          <button type="button" onClick={addStudent} className="button">
            Add Student
          </button>
          <button type="button" onClick={updateStudent} className="button">
            Update Student
          </button>
          <button type="button" onClick={() => getStudent(studentData.id)} className="button">
            Get Student
          </button>
          <button type="button" onClick={() => deleteStudent(studentData.id)} className="button">
            Delete Student
          </button>
          {enteredDetails && <div className="entered-details">Entered Details: {enteredDetails}</div>}
        </form>
      </div>
      <div className="student-list-container">
        <h2 className="subtitle">Student List</h2>
        <table className="student-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.name + student.age}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.grade}</td>
                <td>
                  <button onClick={() => getStudent(student.id)} className="button">
                    Get
                  </button>
                  <button onClick={() => deleteStudent(student.id)} className="button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentForm;
