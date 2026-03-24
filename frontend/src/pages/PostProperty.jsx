import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert, InputGroup, Container } from 'react-bootstrap';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from 'axios';

const PostProperty = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [propertyData, setPropertyData] = useState({
    type: 'Home', purpose: 'Sell', price: '', location: '', sellerType: 'Casual'
  });

  const setupRecaptcha = (number) => {
    // Purana verifier reset karein agar page reload na hua ho
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    // Naya Recaptcha initialize karein (auth pass karna zaroori hai)
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
      'size': 'invisible' 
    });

    return signInWithPhoneNumber(auth, number, window.recaptchaVerifier);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      // Phone number format check karein (+91 mandatory hai)
      const res = await setupRecaptcha("+91" + phoneNumber);
      setConfirmationResult(res);
      setStep(2);
    } catch (err) { 
      console.error(err);
      alert("Error: " + err.message); 
    }
  };

  const handleVerifyAndSave = async () => {
    try {
      // 1. OTP Verify karein
      await confirmationResult.confirm(otp);
      
      // 2. Data format set karein
      const finalData = { 
        ...propertyData, 
        sellerPhone: "91" + phoneNumber,
        price: Number(propertyData.price) // Number format mein bhejein
      };

      // 3. Backend Database mein save karein
      const response = await axios.post('http://localhost:5000/api/properties', finalData);
      
      if (response.status === 201 || response.status === 200) {
        setStep(3);
      }
    } catch (err) { 
      console.error(err);
      alert("Invalid OTP or Server Offline!"); 
    }
  };

  return (
    <Container className="py-5">
      {/* Ye div recaptcha ke liye hona zaroori hai */}
      <div id="recaptcha-container"></div>

      <Card className="shadow-lg border-0 mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-4">
          {step === 1 && (
            <Form onSubmit={handleSendOTP}>
              <h3 className="text-center mb-4">Post Property</h3>
              <Row className="mb-3">
                <Col><Form.Label className="fw-bold">Type</Form.Label>
                  <Form.Select onChange={e => setPropertyData({...propertyData, type: e.target.value})}>
                    <option value="Home">Home</option>
                    <option value="Land">Land</option>
                  </Form.Select>
                </Col>
                <Col><Form.Label className="fw-bold">Purpose</Form.Label>
                  <Form.Select onChange={e => setPropertyData({...propertyData, purpose: e.target.value})}>
                    <option value="Sell">Sell</option>
                    <option value="Rent">Rent</option>
                  </Form.Select>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Price (₹)</Form.Label>
                <Form.Control required type="number" placeholder="Enter Amount" onChange={e => setPropertyData({...propertyData, price: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Location</Form.Label>
                <Form.Control required placeholder="e.g. Mansarovar, Jaipur" onChange={e => setPropertyData({...propertyData, location: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">WhatsApp Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+91</InputGroup.Text>
                  <Form.Control required type="tel" placeholder="10 digit number" onChange={e => setPhoneNumber(e.target.value)} />
                </InputGroup>
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 py-2 fw-bold">Send OTP</Button>
            </Form>
          )}

          {step === 2 && (
            <div className="text-center py-3">
              <h5 className="mb-3">Enter 6-Digit OTP</h5>
              <Form.Control 
                type="text" 
                className="mb-3 text-center fw-bold fs-4" 
                placeholder="000000" 
                onChange={e => setOtp(e.target.value)} 
              />
              <Button variant="success" className="w-100 fw-bold" onClick={handleVerifyAndSave}>Confirm & Post Property</Button>
              <Button variant="link" className="mt-2 text-muted" onClick={() => setStep(1)}>Change Number</Button>
            </div>
          )}

          {step === 3 && (
            <Alert variant="success" className="text-center py-4">
              <i className="bi bi-check-circle-fill display-4 d-block mb-3"></i>
              <h4>Property Posted Successfully! ✅</h4>
              <p>Aapki property ab Home page par live hai.</p>
              <Button href="/" variant="dark" className="mt-2 px-4">Go to Home Page</Button>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostProperty;