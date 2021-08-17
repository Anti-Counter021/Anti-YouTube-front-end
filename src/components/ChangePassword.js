import React, {useState} from "react";

import {Button, Form, FormGroup, FormLabel, FormControl, Alert} from "react-bootstrap";

import WithServices from "./WithService";
import {GetAccessToken} from "../Tokens";

const ChangePassword = ({Service}) => {

    const [show, setShow] = useState(false);

    const changePassword = async (event) => {
        event.preventDefault();

        document.querySelector('#btn-change-password').style.opacity = '0';
        const data = Object.fromEntries(new FormData(event.target).entries());

        await Service.changePassword(GetAccessToken(), data)
            .then(res => {

                document.querySelectorAll('input').forEach(
                    item => item.style.border = '1px solid #ced4da'
                );

                setShow(true);
                const alert_div = document.querySelector('.alert');

                if (res.detail) {
                    alert_div.classList.add('alert-warning')
                    alert_div.classList.remove('alert-success')
                    if (typeof res.detail === 'object') {
                        document.querySelector('#error').textContent = res.detail[0].msg;

                        if (res.detail[0].msg.toLowerCase().indexOf('old password') + 1) {
                            document.querySelector('[name="old_password"]').style.border = '1px solid #e50707';
                        } else if (res.detail[0].msg.toLowerCase().indexOf('not match') + 1) {
                            document.querySelector('[name="password"]').style.border = '1px solid #e50707';
                            document.querySelector('[name="confirm_password"]').style.border = '1px solid #e50707';
                        } else if (res.detail[0].msg.toLowerCase().indexOf('password') + 1) {
                            document.querySelector('[name="password"]').style.border = '1px solid #e50707';
                        }
                    } else {
                        document.querySelector('#error').textContent = res.detail;
                        document.querySelector('[name="old_password"]').style.border = '1px solid #e50707';
                    }
                } else {
                    alert_div.classList.remove('alert-warning')
                    alert_div.classList.add('alert-success')
                    document.querySelector('#error').textContent = res.msg;
                    document.querySelectorAll('input[type="password"]').forEach(
                        item => item.value = ''
                    );
                }

            })
            .catch(error => console.log(error));

        document.querySelector('#btn-change-password').style.opacity = '1';
    }

    return (
        <Form className="text-center col-md-8 pb-5" onSubmit={changePassword}>

            <h2>Change password</h2>

            {
                show ? (
                    <Alert variant="warning" onClose={() => setShow(false)}>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => setShow(false)} variant="warning" style={{color: "#000"}}>
                                X
                            </Button>
                        </div>
                        <p id="error"/>
                    </Alert>
                ) : null
            }

            <FormGroup>
                <FormLabel>Old password<span className="required">*</span></FormLabel>
                <FormControl required name="old_password" type="password" placeholder="Old password"/>
            </FormGroup>

            <FormGroup>
                <FormLabel>Password<span className="required">*</span></FormLabel>
                <FormControl required name="password" type="password" placeholder="Password"/>
            </FormGroup>

            <FormGroup>
                <FormLabel>Confirm password<span className="required">*</span></FormLabel>
                <FormControl required name="confirm_password" type="password" placeholder="Confirm password"/>
            </FormGroup>

            <Button id="btn-change-password" className="mt-3" variant="success" type="submit">
                Change password
            </Button>

        </Form>
    );

}

export default WithServices()(ChangePassword);
