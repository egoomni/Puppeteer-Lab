module.exports["get_iso_date"] = () => {

  const gimme_date = new Date();
  const date_offset = new Date().getTimezoneOffset();
  gimme_date.setMinutes(gimme_date.getMinutes() - date_offset);
  return gimme_date.toISOString().split("T")[0];

};
