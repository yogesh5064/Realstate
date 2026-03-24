import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const PropertyCard = ({ data }) => {
  const openWhatsApp = () => {
    const msg = `Hi, I'm interested in your ${data.type} in ${data.location}. Price: ${data.price}`;
    window.open(`https://wa.me/${data.sellerPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img variant="top" src="https://via.placeholder.com/300x180?text=Property+Image" />
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <Badge bg="primary">{data.type}</Badge>
          <Badge bg={data.purpose === 'Rent' ? 'success' : 'danger'}>For {data.purpose}</Badge>
        </div>
        <Card.Title>{data.title || "Property Details"}</Card.Title>
        <Card.Text className="text-muted mb-1">📍 {data.location}</Card.Text>
        <h5 className="text-dark fw-bold">₹ {data.price}</h5>
        <Button variant="outline-success" className="w-100 mt-2" onClick={openWhatsApp}>
          Chat on WhatsApp
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;