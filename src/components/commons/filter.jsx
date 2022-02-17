const Filter = ({
  items,
  onFilterHandler,
  textProperty,
  valueProperty,
  selectedItem,
}) => {
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          style={{ cursor: "pointer" }}
          key={item[valueProperty]}
          className={
            item === selectedItem ? "active list-group-item" : "list-group-item"
          }
          onClick={() => onFilterHandler(item)}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

Filter.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default Filter;
