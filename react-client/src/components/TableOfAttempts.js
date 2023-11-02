import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Fragment} from "react";
function TableOfAttempts(props) {
        const cardStyle = {
            border: '1px solid #ccc',
            borderRadius: '20px',
            padding: '16px',
            margin: '16px',
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            color: '#333',
            fontFamily: 'sans-serif',
            maxWidth: '500px'
        };
    return (
        <Fragment>
        <div className="container-fluid ">
            <div className="row">
                <div className="col-4">
                </div>
                <div className="col-4">
                    <div className="card bg-light text-center" style={cardStyle}>
                        <h6 className="card-title"><b>your history of guesses will appear below</b></h6>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <table className="table table-striped table-bordered bg-light">
                        <thead>
                        <tr>
                            <th scope="col">Guess</th>
                            <th scope="col">Bulls</th>
                            <th scope="col">Cows</th>
                        </tr>
                        </thead>
                        <tbody>
                        {props.attempts.map((attempt, index) => (
                            <tr key={index}>
                                <td>{attempt.guess}</td>
                                <td>{attempt.bulls}</td>
                                <td>{attempt.cows}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </Fragment>
    );
}

export default TableOfAttempts;