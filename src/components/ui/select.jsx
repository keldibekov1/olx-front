const Select = ({ options, ...props }) => {
    return (
      <select className="border p-2 rounded w-full" {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
  
  export default Select;
  