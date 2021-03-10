import { Link } from "react-router-dom";

export const LinksList = ({ links }) => {
  if (!links.length) {
    return <p>No links here yet...</p>;
  }

  return (
    <div style={{width: '600px'}}>
    <table>
      <thead>
        <tr>
          <th>N</th>
          <th>Original link</th>
          <th>Short link</th>
          <th>Open</th>
        </tr>
      </thead>

      <tbody>
        {links.map((link, index) => {
          return (
            <tr key={link._id}>
              <td>{index + 1}</td>
              <td>{link.from}</td>
              <td>{link.to}</td>
              <td>
                <Link to={`/detail/${link._id}`} >Open</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
};
