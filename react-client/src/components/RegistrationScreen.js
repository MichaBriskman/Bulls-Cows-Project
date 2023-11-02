import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Fragment, useState, useEffect} from "react";
import axios from 'axios';
function RegistrationScreen(props) {
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
    const [arrScores, setArrScores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [changed, setChanged] = useState(0);
    const [error, setError] = useState({
        hasError : false,
        error : ""
    });
    function handleError(error_1) {
        setError({
            hasError: true,
            error: `${error_1.toString()}`}
        );
    }
    function handleResponse(response) {
        if (!response.ok) {
            if(response.status===500)
                throw new Error("cant connect to the server.");
            else
                throw new Error(`Some error occurred : ${response.status} ${response.text}`);
        }
        return response;
    }
    function handleJson(response) {
        setChanged(changed+1);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // set loading state to true to show loading indicator for example
            try {
                const result = await axios('/java_react_war/api/highscores');
                setArrScores(result.data.topScores); // set data state
            } catch (error) {
                handleError(error) // an error occurred, set error state to true
            } finally {
                setIsLoading(false); // hide loading indicator
            }
        };

        fetchData(); // execute the function above

    }, [changed]); // trigger the effect when arrScores changes

    function fetchPostNameAndScore(event){
        event.preventDefault();
        let nameScore = {
            name: event.target.elements.name.value,
            score: props.attemtpsCounter
        }
        setSubmitted(true);
            fetch("/java_react_war/api/highscores", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'datatype': 'json'
                },
                body: JSON.stringify(nameScore)
            })
            .then(handleResponse)
            .then(handleJson)
            .catch(handleError);
    }
return (
    <Fragment>
        <div className="container-fluid">
            {error.hasError && (
                <div className="row">
                    <div className="col-4">
                    </div>
                    <div className="col-4">
                        <div className="card bg-light text-center" style={cardStyle}>
                            <h4 className="card-title text-danger"><b>{error.error}</b></h4>
                        </div>
                    </div>
                </div>
            )}
            {!submitted ?
                (<Fragment>
                    <div className="row">
                        <div className="col-4">
                        </div>
                        <div className="col-4">
                            <div className="card bg-light text-center" style={cardStyle}>
                                <h4 className="card-title"><b>You Won!</b></h4>
                                <h5><b>Your score is: {props.attemtpsCounter}</b></h5>
                            </div>
                        </div>
                    </div>
                <div className="row">
                    <div className='col-4'>
                    </div>
                    <div className="col-4">
                        <form onSubmit={fetchPostNameAndScore} className='text-center'>
                            <label htmlFor="name"><h5>Enter your name:</h5></label>
                            <input type="text" className="form-control" name="name" id="name" pattern="[a-zA-Z0-9\s+]+" maxLength="25" required/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </Fragment>) :
                (<Fragment>
                    <div className="row">
                        <div className="col-4">
                        </div>
                        <div className="col-4">
                            <div className="card bg-light" style={cardStyle}>
                                <h4 className="text-center">High Scores:</h4>
                            </div>
                        </div>
                        <table className="table table-striped table-bordered bg-light text-center">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <tr><td>
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only"></span>
                                    </div></td></tr>
                                ) : (arrScores.map((score,index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{score.name}</td>
                                    <td>{score.score}</td>
                                </tr>
                                ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Fragment>)}
        </div>
    </Fragment>
);
}

export default RegistrationScreen;