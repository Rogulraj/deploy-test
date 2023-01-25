import React, { useState } from "react";
import axios from "axios";

function Form() {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  console.log(formData);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/api/add", formData)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const getData = async () => {
    const getResponse = await axios.get("/api/get");
    const response = await getResponse.data;
    console.log(response);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="number" name="id" onChange={handleChange} />
        <input type="text" name="name" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <button type="button" onClick={getData}>
        get
      </button>
    </div>
  );
}

export default Form;
