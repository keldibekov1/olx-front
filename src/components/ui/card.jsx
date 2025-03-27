const Card = ({ children }) => {
    return (
      <div className="border rounded-lg shadow-md p-4 bg-white">
        {children}
      </div>
    );
  };
  
  export default Card;
  