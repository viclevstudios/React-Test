import { Link } from 'react-router-dom';
import "./NotFound.css";

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Seite nicht gefunden</h2>
      <p>Die angeforderte Seitekonnte nicht gefunden werden.</p>
      <Link to="/" className="not-found-link">Zurück zur Startseite</Link>
    </div>
  );
}
export default NotFound;