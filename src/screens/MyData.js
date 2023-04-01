import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import React from 'react';

// TODO: change InputForm class into a function so that we can use hooks and store the selected sex value in a shared state by both radio buttons!!
class InputForm extends React.Component{
    constructor() {
        super();
    }

    render(){
        return(
            <>
                {!this.props.inverseOrder &&
                    <Label for={this.props.name}>
                        {this.props.label}
                    </Label>
                }

                <Input
                    name={this.props.name}
                    placeholder={this.props.placeholder && this.props.placeholder}
                    type={this.props.type}
                    value={this.props.value && this.props.value}
                />

                {this.props.inverseOrder &&
                    <Label for={this.props.name}>
                        {this.props.label}
                    </Label>
                }
            </>
        );
    }
}

export default function MyData() {
    let formButton = (event) => {
        event.preventDefault(); //TODO: change this function...
        alert("Hey");
    }

    return (
        <div>
            <h2 style={{textAlign: "center", marginTop: "7vh", marginBottom: "5vh"}}>My personal data</h2>

            <Form>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <InputForm type="text" name="fName" label={"Firstname"} placeholder={"Firstname"}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <InputForm type="text" name="lName" label={"Lastname"} placeholder={"Lastname"}/>
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <InputForm type="email" name="email" label={"Email"} placeholder={"Email"}/>
                </FormGroup>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <InputForm type="date" name="bdate" label={"Birthdate"} placeholder={"Birthdate"}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <Col md={1}>
                            <label htmlFor={"sex"}>Sex</label>
                        </Col>
                        <Row style={{marginTop: "1.5vh"}}>
                            <Col md={4}>
                                <FormGroup check>
                                    <InputForm name={"sex"} type={"radio"} label={"Woman"} inverseOrder={1} value={"Woman"}/>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup check>
                                    <InputForm name={"sex"} type={"radio"} label={"Man"} inverseOrder={1} value={"Man"}/>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>


                <Button color="success" onClick={formButton} style={{marginTop: "1vh", marginBottom: "2vh"}}>
                    Save changes
                </Button>
            </Form>

            <p>
                <Link to="/">Go To The Home Page</Link>
            </p>
        </div>
    );
}