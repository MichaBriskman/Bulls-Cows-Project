import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Fragment, useState} from "react";
import TableOfAttempts from "./TableOfAttempts";
import RegistrationScreen from "./RegistrationScreen"


const GameScreen = () => {
    const GUESS_LENGTH = 4;

    const [showRulesGame, setShowRulesGame] = useState(false);
    const handleButtonGamesRules = () => {
        setShowRulesGame(!showRulesGame);
    };

    const [numberToGuess, setNumberToGuess] = useState(() =>{
        return getRandomNumberToGuess();
    });
    function getRandomNumberToGuess() {
        let generated_number = '';
        for(let i=0; i < GUESS_LENGTH; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            if(generated_number.includes(randomNumber.toString()))
                i--;
            else
                generated_number += randomNumber.toString();
        }
        console.log(generated_number);
        return generated_number;
    }
    const options = [...Array(10)].map((_, i) => ({
        value: i,
        label: i.toString(),
    }));
    const [values, setValues] = useState({
        Digit_1: '',
        Digit_2: '',
        Digit_3: '',
        Digit_4: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const [attemptsCounter, setAttemptsCounter] = useState(0);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState([]);
    function handleAttempt(event) {
        event.preventDefault();
        setAttemptsCounter(attemptsCounter + 1);

        let guess = "";
        guess += event.target.elements.Digit_1.value.toString();
        guess += event.target.elements.Digit_2.value.toString();
        guess += event.target.elements.Digit_3.value.toString();
        guess += event.target.elements.Digit_4.value.toString();

        let bulls = 0;
        let cows = 0;
        for (let i = 0; i < GUESS_LENGTH; i++) {
            if (guess[i] === numberToGuess[i])
                bulls++;
            else if (numberToGuess.includes(guess[i]))
                cows++;
        }
        if(bulls === GUESS_LENGTH) {
            setWon(true);
        }
        const newAttempt = {
            guess: guess,
            bulls: bulls,
            cows: cows,
        };
        setAttempts([newAttempt, ...attempts]);
    }
    function handleButtonNewGame() {
        setValues({
            Digit_1: '',
            Digit_2: '',
            Digit_3: '',
            Digit_4: '',
        });
        setAttemptsCounter(0);
        setWon(false);
        setNumberToGuess(() =>{
            return getRandomNumberToGuess();
        });
        setAttempts([]);
    }

    return (
        <Fragment>
            <div className="container-fluid text-center">
                <div className="row">
                    <div className="col">
                        <img src="/bulls_cows.png" alt="bulls_cows" width="300" height="300"/>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <br></br>
                    </div>
                    <div className="col-4">
                        <button type="button" className="btn btn-danger" id="new_game"
                                onClick={handleButtonNewGame}>New Game</button>
                    </div>
                    <div className="col-4">
                        <h3>Micha & Shlomo</h3>
                    </div>
                    <div className="col-4">
                        <button type="button" className="btn btn-warning" id="game_rules"
                                onClick={handleButtonGamesRules}>Game Rules</button>
                        {showRulesGame && (
                            <div className="bg-light">
                                <p>Bulls and Cows is a 2 player game. One player thinks of a number, while
                                    the other player tries to guess it. The number to be guessed must be a 4
                                    digit number, using only digits from 0 - 9, each digit at most once. e.g.
                                    1234 is valid, 9877 is not valid, 9876 is valid.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <br></br>
                </div>
            </div>
            {!won ? (
            <div className="container-fluid text-center">
                    <form className="form-control" onSubmit={handleAttempt}>
                        <div className="row">
                            {[...Array(4)].map((_, index) => (
                                <div className="col-3" key={`digit_${index+1}`}>
                                    <label key={index+1}>
                                        <select className="form-select-lg mb-3" id={`Digit_${index+1}`} name={`Digit_${index+1}`}
                                                value={values[`Digit_${index + 1}`]} onChange={handleInputChange} required>
                                            <option value="" disabled>Guess...</option>
                                            {options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            ))}
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-primary btn-block" type="submit" id="submitLogin" >Go!</button>
                                </div>
                            </div>
                        </div>
                    </form>
                <TableOfAttempts attempts={attempts}/>
            </div>
                ) : (<RegistrationScreen attemtpsCounter = {attemptsCounter}/>)}
        </Fragment>
    );
};

export default GameScreen;