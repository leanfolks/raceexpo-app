/* eslint-disable react/prop-types */

const Race = (props) => {
  const { formik, handleAddRaceBtnClick, showRace } = props;
  let race = formik.values.race;

  const handleRemoveClick = (index) => {
    const updatedRace = [...formik.values.race];
    updatedRace.splice(index, 1);

    formik.setFieldValue("race", updatedRace);
  };

  const handleAddRace = (index, value) => {
    const updatedRace = [...formik.values.race];
    updatedRace[index] = value;

    const isDuplicate = updatedRace.some(
      (ele, i) => i !== index && ele === value
    );
    console.log(isDuplicate, "isDuplicate");
    if (isDuplicate) {
      formik.setFieldError(
        `race`,
        "Race already exists. Please create different race"
      );
    } else {
      formik.setFieldValue("race", updatedRace);
    }
  };
  return (
    <div>
      {/* <label className="text-16">Race</label> */}
      <button
        type="button"
        onClick={handleAddRaceBtnClick}
       className="button btn border p-2 fw-bold rounded-3 mt-3"
      >
        Add Race
      </button>
      {race.length > 1 || showRace ? (
        <>
          {/* {race.length ? ( */}
          <div>
            {race.map((ele, index) => {
              return (
                <div className="race-input-container" key={index}>
                  <div className="form-input">
                    <input
                      type="text"
                      id="race"
                      name="race"
                      value={formik.values.race[index]}
                      onChange={(event) =>
                        handleAddRace(index, event.target.value.toUpperCase())
                      }
                      onBlur={formik.handleBlur}
                    />
                        {formik.touched.race &&
                  formik.touched.race[index] &&
                  formik.errors.race &&
                  formik.errors.race[index] && (
                    <div className="text-danger">{formik.errors.race[index]}</div>
                  )}
                  </div>
                  <button
                    type="button"
                    onClick={()=>handleRemoveClick(index)}
                    className="button btn border p-2 fw-bold rounded-3 mt-3"
                    style={{ height: "50px", marginLeft: "15px" }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            {/* {formik.touched.race && formik.errors.race ? (
              <div className="text-danger">{formik.errors.race}</div>
            ) : null} */}
          </div>
          {/* ) : null} */}
        </>
      ) : null}
    </div>
  );
};

export default Race;
