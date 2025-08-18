import React, { useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateForm = () => {
  const token = localStorage.getItem("core-token");
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    deadline: "",
    WaLink: "",
    fileUploadEnabled: false,
    posterImageDriveId: "",
    extraLinkName: "",
    extraLink: "",
    isHidden: false,
    isOpenForAll: false,
  });

  const [questions, setQuestions] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [enableTeams, setEnableTeams] = useState(false);
  const [teamSize, setTeamSize] = useState("");
  const [receivePayment, setReceivePayment] = useState(false); // Boolean for payment requirement
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    qrCodeUrl: "",
  });

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        required: false,
        options: [],
      },
    ]);
    setInputValues([...inputValues, ""]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const updatedInputValues = inputValues.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setInputValues(updatedInputValues);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options = [
      ...(updatedQuestions[index].options || []),
      "",
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const handleFormSubmit = async () => {
    if (
      !formData.name ||
      !formData.desc ||
      !formData.deadline ||
      !formData.WaLink
    ) {
      toast.error(
        "Form title, description, deadline, and WhatsApp link are required.",
      );
      return;
    }

    const formObject = {
      name: formData.name.trim(),
      desc: formData.desc.trim(),
      deadline: formData.deadline.trim(),
      WaLink: formData.WaLink.trim(),
      formFields: questions,
      enableTeams,
      teamSize: enableTeams ? teamSize : null,
      fileUploadEnabled: formData.fileUploadEnabled,
      receivePayment,
      amount: receivePayment ? paymentDetails.amount : 0,
      qrCodeUrl: receivePayment ? paymentDetails.qrCodeUrl.trim() : null,
      payments: [],
      posterImageDriveId: formData.posterImageDriveId.trim(),
      extraLinkName: formData.extraLinkName.trim(),
      extraLink: formData.extraLink.trim(),
      isHidden: formData.isHidden,
      isOpenForAll: formData.isOpenForAll
    };

    const toastId = toast.loading("Creating form...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formObject),
        },
      );

      if (response.ok) {
        toast.success("Form created successfully", { id: toastId });
        setFormData({ name: "", desc: "", deadline: "", WaLink: "" });
        setQuestions([]);
        setInputValues([]);
        setEnableTeams(false);
        setTeamSize("");
        setReceivePayment(false);
        setPaymentDetails({ amount: 0, qrCodeUrl: "" });
      } else {
        console.error("Error creating form");
        toast.error("Error creating form", { id: toastId });
      }
    } catch (error) {
      console.error("Network error", error);
      toast.error("Network error", { id: toastId });
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ direction: 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'blockquote',
    'code-block',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'align',
    'direction',
    'link',
    'image',
    'video'
  ];

  return (
    <div className="flex w-full flex-col justify-center">
      <h3 className="mb-4 mt-10 text-center text-3xl">
        Admin - Create New Form
      </h3>
      <div className="mx-auto mb-48 h-full min-h-screen w-[80%] rounded-xl md:w-[60%]">
        <div className="flex flex-col gap-2 rounded-lg border border-t-[.5rem] border-blue-800 bg-white p-6 px-10">
          <input
            type="text"
            placeholder="Form Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-lg border px-4 py-2 text-2xl text-black"
          />
          <div className="editor-container mb-24">
            <ReactQuill
              theme="snow"
              value={formData.desc}
              onChange={(content) =>
                setFormData({ ...formData, desc: content })
              }
              modules={modules}
              formats={formats}
              placeholder="Form Description"
              className="h-48 rounded-lg text-slate-500"
            />
          </div>
          <input
            type="text"
            placeholder="Poster Image Drive ID"
            value={formData.posterImageDriveId}
            onChange={(e) =>
              setFormData({ ...formData, posterImageDriveId: e.target.value })
            }
            className="rounded-lg border px-4 py-2 text-lg text-black mt-10"
          />
          <input
            type="text"
            placeholder="Extra Link Name"
            value={formData.extraLinkName}
            onChange={(e) =>
              setFormData({ ...formData, extraLinkName: e.target.value })
            }
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
          {formData.extraLinkName && (
            <input
              type="text"
              placeholder="Extra Link"
              value={formData.extraLink}
              onChange={(e) =>
                setFormData({ ...formData, extraLink: e.target.value })
              }
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          )}
          <input
            type="date"
            placeholder="Deadline"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
          <input
            type="text"
            placeholder="WhatsApp Group Link"
            value={formData.WaLink}
            onChange={(e) =>
              setFormData({ ...formData, WaLink: e.target.value })
            }
            className="rounded-lg border px-4 py-2 text-lg text-black"
          />
        </div>

        {questions.map((ques, i) => (
          <div
            key={i}
            className="my-4 flex flex-col gap-2 rounded-lg border px-4 py-2"
          >
            <input
              type="text"
              placeholder="Question Text"
              value={ques.questionText}
              onChange={(e) =>
                handleQuestionChange(i, "questionText", e.target.value)
              }
              className="rounded-lg border px-4 py-2 text-lg font-semibold"
            />
            <select
              value={ques.questionType}
              onChange={(e) =>
                handleQuestionChange(i, "questionType", e.target.value)
              }
              className="rounded-lg border px-4 py-2"
            >
              <option value="text">Text</option>
              <option value="longtext">Long Text</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>
            {["checkbox", "dropdown"].includes(ques.questionType) && (
              <div className="mt-2 flex flex-col gap-2">
                {ques.options &&
                  ques.options.map((option, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${j + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(i, j, e.target.value)
                        }
                        className="rounded-lg border px-4 py-2 text-lg"
                      />
                      <button
                        onClick={() => handleRemoveOption(i, j)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                <button
                  onClick={() => handleAddOption(i)}
                  className="mt-2 text-blue-500"
                >
                  Add Option
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <label>Required:</label>
              <input
                type="checkbox"
                checked={ques.required}
                onChange={(e) =>
                  handleQuestionChange(i, "required", e.target.checked)
                }
              />
            </div>
            <button
              onClick={() => removeQuestion(i)}
              className="mt-2 cursor-pointer rounded-md bg-red-500 p-2 text-white"
            >
              Remove Question
            </button>
          </div>
        ))}

        <button
          onClick={addNewQuestion}
          className="my-4 rounded-md bg-green-500 p-2 text-white"
        >
          Add Question
        </button>

        <div className="my-4 flex items-center gap-2">
          <label>Enable Teams:</label>
          <input
            type="checkbox"
            checked={enableTeams}
            onChange={(e) => setEnableTeams(e.target.checked)}
          />
        </div>

        {/* Add checkbox for enabling file upload */}
        <div className="my-4 flex items-center gap-2">
          <label>Is Hidden:</label>
          <input
            type="checkbox"
            checked={formData.isHidden}
            onChange={(e) =>
              setFormData({ ...formData, isHidden: e.target.checked })
            }
          />
        </div>

        <div className="my-4 flex items-center gap-2">
          <label>Is Open For All:</label>
          <input
            type="checkbox"
            checked={formData.isOpenForAll}
            onChange={(e) =>
              setFormData({ ...formData, isOpenForAll: e.target.checked })
            }
          />
        </div>

        <div className="my-4 flex items-center gap-2">
          <label>Enable File Upload:</label>
          <input
            type="checkbox"
            checked={formData.fileUploadEnabled}
            onChange={(e) =>
              setFormData({ ...formData, fileUploadEnabled: e.target.checked })
            }
          />
        </div>

        {enableTeams && (
          <div className="my-4">
            <input
              type="number"
              placeholder="Team Size"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          </div>
        )}

        {/* Payment */}
        <div className="my-4 flex items-center gap-2">
          <label>Receive Payment:</label>
          <input
            type="checkbox"
            checked={receivePayment}
            onChange={(e) => setReceivePayment(e.target.checked)}
          />
        </div>

        {receivePayment && (
          <div className="my-4">
            <input
              type="number"
              placeholder="Amount"
              value={paymentDetails.amount}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, amount: e.target.value })
              }
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
            <input
              type="text"
              placeholder="QR Code URL"
              value={paymentDetails.qrCodeUrl}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  qrCodeUrl: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-2 text-lg text-black"
            />
          </div>
        )}

        <button
          onClick={handleFormSubmit}
          className="mt-6 rounded-lg bg-blue-500 py-2 text-lg text-white"
        >
          Create Form
        </button>
      </div>
      <style jsx>{`
        .editor-container {
          min-height: 200px;
          margin-bottom: 20px;
        }

        .ql-container {
          min-height: 150px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .ql-picker-options{
          width: fit-content;
          min-width: 150px;
        }
      `}</style>
    </div>
  );
};

export default CreateForm;
