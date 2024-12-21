import OrganizerSignupForm from "./OrganizerSignupForm";
import BlockingLoader from "../Common/Loader";
import { useState } from "react";
const OrganizerSignup = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>

{loading && <BlockingLoader/> }
      <section className="layout-pt-lg layout-pb-lg bg-blue-2 my-3">
        <div className="container p-3">
        <div className="row justify-content-center align-items-center">
          <div className="col-4 border p-3 border-1">
                <OrganizerSignupForm isRaceExpoOrganizer={true} setLoading={setLoading} />
                </div>
                </div>

         
           
        </div>
      </section>


    </>
  );
};

export default OrganizerSignup;
