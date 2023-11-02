import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Container } from 'react-bootstrap';
import GameScreen from './components/GameScreen'

function App() {
  return (
        <div className="App">
            {/*<div style={backgroundStyle}>*/}

            <Container
                style={{
                    backgroundImage: `url('/background.jpg')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                }}
            >
           <GameScreen/>
            </Container>
            {/*</div>*/}
        </div>

  );
}

export default App;
