import React from "react";
    import toast from "react-hot-toast";

const Contact = () => {


const handleSubmit = (e) => {
  e.preventDefault(); // Prevent page reload
  toast.success("Message sent successfully!");
};

  return (
    <div className="mt-10 px-4 md:px-16 lg:px-24 xl:px-32 min-h-[70vh]">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Contact Us</h2>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-medium mb-4">Send us a Message</h3>
          <form className="flex flex-col gap-4"  onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 px-4 py-2 rounded outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 px-4 py-2 rounded outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="border border-gray-300 px-4 py-2 rounded outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-white font-semibold py-2 rounded hover:bg-primary/90 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info / Map */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-medium mb-4">Contact Information</h3>
            <p className="mb-2 text-gray-600">
              <strong>Email:</strong> support@greencart.com
            </p>
            <p className="mb-2 text-gray-600">
              <strong>Phone:</strong> +92 300 1234567
            </p>
            <p className="mb-4 text-gray-600">
              <strong>Address:</strong> GreenCart HQ, Lahore, Pakistan
            </p>
          </div>
          <iframe
            title="Location Map"
            src="https://maps.google.com/maps?q=Lahore&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-48 rounded mt-4"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
