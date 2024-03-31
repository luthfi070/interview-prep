import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import axios from "axios";
import { Badge, Button, Form } from "react-bootstrap";

type clinicResponse = {
  _id: string;
  name: string;
  open: string;
  close: string;
  timeSlot: number;
  quota: number;
};

type clinicRequest = {
  name: string;
  open: string;
  close: string;
  timeSlot: number;
  quota: number;
};

type slotResponse = {
  time: string;
  quota: number;
};

function App() {
  const [clinic, setClinic] = useState<clinicResponse[]>([]);
  const [clinicSlot, setClinicSlot] = useState<slotResponse[]>([]);
  const [clinicRequest, setClinicRequest] = useState<clinicRequest>({
    name: "",
    open: "",
    close: "",
    timeSlot: 0,
    quota: 0,
  });

  const [loading, isLoading] = useState(true);
  const [detail, isDetail] = useState(false);

  const handleChange = (e: any): void => {
    const { name, value } = e.currentTarget;

    setClinicRequest({ ...clinicRequest, [name]: value });
  };

  const createClinic = () => {
    axios
      .post(
        "https://slot-generator-418905.as.r.appspot.com/clinic",
        clinicRequest
      )
      .then((res) => {
        fetchClinic();
      });
  };

  const fetchClinic = () => {
    axios
      .get<clinicResponse[]>(
        "https://slot-generator-418905.as.r.appspot.com/clinic"
      )
      .then((res) => {
        setClinic(res.data);
      });
  };

  const fetchSlot = (id: string) => {
    axios
      .get<slotResponse[]>(
        `https://slot-generator-418905.as.r.appspot.com/clinic/slot/${id}`
      )
      .then((res) => {
        setClinicSlot(res.data);
        isDetail(true);
      });
  };

  useEffect(() => {
    fetchClinic();
    isLoading(false);
    console.log(clinic);
  }, []);

  return (
    <div className='App mt-5'>
      <div className='container fluid'>
        <div className='row'>
          <div className='col'>
            {loading ? (
              <>loading...</>
            ) : (
              <>
                {clinic.map((item) => {
                  return (
                    <div className='mb-2'>
                      Name: {item.name}{" "}
                      <Button onClick={() => fetchSlot(item._id)}>Check</Button>
                    </div>
                  );
                })}
              </>
            )}
            {detail ? (
              <>
                {clinicSlot.map((slot) => {
                  return (
                    <div className='mb-2'>Time Available: {slot.time}</div>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
          <div className='col'>
            <div className='row '>
              {" "}
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label className='align-left'>Clinic Name</Form.Label>
                  <Form.Control
                    name='name'
                    type='text'
                    placeholder='Enter clinic name'
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Time Open</Form.Label>
                  <Form.Control
                    name='open'
                    type='text'
                    placeholder='ex : 10:30'
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Time Close</Form.Label>
                  <Form.Control
                    name='close'
                    type='text'
                    placeholder='ex : 10:30'
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>
                    How long time for each client ? ( in minutes )
                  </Form.Label>
                  <Form.Control
                    name='timeSlot'
                    type='text'
                    placeholder='ex : 15 '
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>
                    How many client are you taking per day ?
                  </Form.Label>
                  <Form.Control
                    name='quota'
                    type='text'
                    placeholder='ex : 15 '
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button onClick={() => createClinic()}>Submit</Button>
              </Form>
            </div>
            <div className='row-xl mt-3 mb-3'>Tech Used</div>
            <div className='row-xl'>
              Backend : NodeJS, Deployed on <b>Google Cloud</b>
            </div>
            <div className='row-xl'>
              Frontend : Typescript React, Deployed on <b>Netlify</b>
            </div>
            <div className='row-xl'>
              Database : MongoDB, Deployed on <b>MongoDB Atlas</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
