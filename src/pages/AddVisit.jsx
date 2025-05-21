const AddVisit = () => {
  return (
    <div className="add-visit">
      <h2>Aggiungi Nuova Visita</h2>
      <form>
        <div className="form-group">
          <label>Data:</label>
          <input type="date" required />
        </div>
        <div className="form-group">
          <label>Ospite:</label>
          <input type="text" required />
        </div>
        <button type="submit">Crea Visita</button>
      </form>
    </div>
  );
};

export default AddVisit;