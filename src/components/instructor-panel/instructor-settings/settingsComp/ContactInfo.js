import { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import instructorPanelService from "../../../../utils/axios/instructorPanelService";
import AlertMessage from "../../another-comp/AlertMessage";

function ContactInfo() {
  const [initialValues, setInitialValues] = useState(null);
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorPanelService.getContactInfo();
        const user = res.user;
        setInitialValues({
          email: user?.email ?? "",
          phone: user?.phone ?? "",
          address: user?.address ?? "",
          zip_code: user?.zip_code ?? "",
        });
      } catch (err) {
        console.error("Error fetching contact info", err);
      }
    };

    fetchData();
  }, []);

  if (!initialValues)
    return <p className="text-black">Loading contact info...</p>;

  const handleSubmit = async (values) => {
    try {
      await instructorPanelService.getContactInfoUpdate({ ...values });

      // 🔹 AlertMessage göster
      setAlert({
        visible: true,
        type: "success",
        message: "Personal Contact Information saved!",
      });
    } catch (err) {
      console.error("Error updating contact info", err);

      setAlert({
        visible: true,
        type: "error",
        message: "Error saving information",
      });
    }
  };
  return (
    <>
      {alert.visible && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ visible: false, type: "", message: "" })}
        />
      )}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex p-10 flex-col gap-4">
            <p className="text-black font-semibold text-xl">Contact</p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 text-sm">Email</label>
                <Field
                  type="email"
                  name="email"
                  disabled
                  placeholder="Enter your e-mail"
                  className="w-full h-14 px-4 opacity-70 placeholder:text-[#8e8e8e] 
                           bg-white font-light text-black shadow outline-0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-700 text-sm">Phone</label>
                <Field
                  type="text"
                  name="phone"
                  placeholder="Enter your phone"
                  className="w-full h-14 px-4 placeholder:text-[#8e8e8e] 
                           bg-white font-light text-black shadow outline-0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-700 text-sm">Address</label>
                <Field
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  className="w-full h-14 px-4 placeholder:text-[#8e8e8e] 
                           bg-white font-light text-black shadow outline-0"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 text-sm">Post Code</label>
                <Field
                  type="text"
                  name="zip_code"
                  placeholder="Enter your post code"
                  className="w-full h-14 px-4 placeholder:text-[#8e8e8e] 
                           bg-white font-light text-black shadow outline-0"
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-full text-sm"
              >
                Save and continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ContactInfo;
