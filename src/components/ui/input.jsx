const Input = ({ type = "text", placeholder, ...props }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        className="border p-2 rounded w-full"
        {...props}
      />
    );
  };
  
  export default Input;
  