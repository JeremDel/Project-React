import { Link } from "react-router-dom";

export default function MyData() {
  return (
    <div>
      <p>This are my data</p>
      <p>
        <Link to="/">Go To The Home Page</Link>
      </p>
    </div>
  );
}
