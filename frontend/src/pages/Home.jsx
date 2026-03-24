import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Form, Container } from 'react-bootstrap';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('https://realstate-gsrm.onrender.com/api/properties')
      .then(res => setProperties(res.data))
      .catch(err => console.log(err));
  }, []);

  const filteredData = properties.filter(p => 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <div className="bg-light p-4 rounded shadow-sm mb-4 mt-3 text-center">
        <h2>Find Your Perfect Property</h2>
        <Form.Control 
          placeholder="Search by location (e.g. Jaipur)..." 
          className="mt-3 w-50 mx-auto"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Row>
        {filteredData.map(p => (
          <Col md={4} key={p._id} className="mb-4">
            <PropertyCard data={p} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;