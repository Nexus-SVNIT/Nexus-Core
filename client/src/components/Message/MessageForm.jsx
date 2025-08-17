import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NotifySubscribers = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [batchInput, setBatchInput] = useState(''); // accept inputs like "u22,i25"
    const [isSending, setIsSending] = useState(false);
    const [serverResponse, setServerResponse] = useState(null);
    const [customAddressing, setCustomAddressing] = useState(false); // new checkbox state

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
        setServerResponse({ ok: false, message: 'Please fill subject and message' });
        return;
    }

    if (!batchInput.trim()) {
        setServerResponse({ 
            ok: false, 
            message: 'Please enter at least one batch prefix or email address' 
        });
        return;
    }

    try {
        setIsSending(true);
        setServerResponse(null);

        const token = localStorage.getItem('core-token');

        // Generate final HTML from template here
        const finalHtml = emailTemplate(message, customAddressing);

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/notify-batch`,
            {
                subject,
                html: finalHtml, // send full template, not raw message
                batches: batchInput.split(',').map(item => item.trim()).filter(Boolean),
                customAddressing
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setServerResponse({
            ok: true,
            data: {
                message: response.data.message,
                totalRecipients: response.data.totalRecipients,
                batches: response.data.batches,
                directEmails: response.data.directEmails
            }
        });

        setSubject('');
        setMessage('');
        setBatchInput('');
    } catch (error) {
        const errMsg = error.response?.data?.message || 'Error sending notification';
        setServerResponse({ ok: false, message: errMsg });
    } finally {
        setIsSending(false);
    }
};

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'align': [] }],  // Add alignment options
            [{'list': 'ordered'}, {'list': 'bullet'}, 
             {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }], // Add color and background options
            ['clean']                                         
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'align',  // Add align format
        'link', 'image', 'video',
        'color', 'background' // Add color and background formats
    ];

    const emailTemplate = (message, customAddressing) => `
    <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" 
                 style="display: block; margin: auto; max-width: 100%; height: auto;"/>
            ${!customAddressing ? '<h3 style="color: white;">Dear {{FULL_NAME}},</h3>' : ''}
            <p style="color: #ccc;">${message}</p>
            <p style="color: #ccc;">Visit <a href="https://www.nexus-svnit.in" style="color: #1a73e8;">this link</a> for more details.</p>
            <p>Thanks,<br>Team NEXUS</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
            <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
        </div>
    </div>
`;


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-slate-800 shadow-lg rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-center text-white mb-4">Notify Subscribers</h2>

                {/* Response panel */}
                {serverResponse && (
                    <div
                        className={`mb-4 rounded-md p-3 text-sm ${
                            serverResponse.ok ? 'bg-green-600/20 text-green-200 border border-green-500/40'
                                               : 'bg-red-600/20 text-red-200 border border-red-500/40'
                        }`}
                    >
                        <div className="font-semibold">
                            {serverResponse.ok ? (serverResponse.data?.message || 'Success') : 'Error'}
                        </div>
                        {serverResponse.ok ? (
                            <div className="mt-1">
                                <div>Recipients: <span className="font-mono">{serverResponse.data?.totalRecipients}</span></div>
                                {Array.isArray(serverResponse.data?.batches) && serverResponse.data.batches.length > 0 && (
                                    <div>Batches: <span className="font-mono uppercase">{serverResponse.data.batches.join(', ')}</span></div>
                                )}
                                {serverResponse.data?.directEmails > 0 && (
                                    <div>Direct emails: <span className="font-mono">{serverResponse.data.directEmails}</span></div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-1">{serverResponse.message}</div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Updated input description for prefixes and direct emails */}
                    <div>
                        <input
                            type="text"
                            placeholder='Enter batches or emails (comma-separated)'
                            value={batchInput}
                            onChange={(e) => setBatchInput(e.target.value)}
                            disabled={isSending}
                            className="w-full text-black-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                            Example: "u22,i25" for batches or "user@example.com,another@mail.com" for direct emails, or direct admissionNumber
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="customAddressing"
                            checked={customAddressing}
                            onChange={e => setCustomAddressing(e.target.checked)}
                            disabled={isSending}
                        />
                        <label htmlFor="customAddressing" className="text-gray-200 text-sm">
                            Custom addressing (use message as-is, no "Dear Name" prefix)
                        </label>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={isSending}
                        className="w-full text-black-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                    <ReactQuill
                        value={message}
                        onChange={setMessage}
                        modules={modules}
                        formats={formats}
                        readOnly={isSending}
                        className={`w-full bg-white p-2 rounded-md min-h-32 h-auto text-black-2 ${isSending ? 'opacity-60 pointer-events-none' : ''}`}
                    />
                    <button
                        type="submit"
                        disabled={isSending}
                        aria-busy={isSending}
                        className={`w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                        {isSending ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            'Notify Subscribers'
                        )}
                    </button>
                </form>

                <div className="bg-white p-4 mt-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Preview</h3>
                    <div dangerouslySetInnerHTML={{ __html: emailTemplate(message, customAddressing) }} />
                </div>
            </div>
            <style jsx global>{`
                .ql-editor p {
                    color: black;
                }
                
                /* Tooltips for toolbar buttons */
                .ql-bold::before { content: "Bold"; }
                .ql-italic::before { content: "Italic"; }
                .ql-underline::before { content: "Underline"; }
                .ql-strike::before { content: "Strike Through"; }
                .ql-blockquote::before { content: "Blockquote"; }
                .ql-list[value="ordered"]::before { content: "Numbered List"; }
                .ql-list[value="bullet"]::before { content: "Bullet List"; }
                .ql-indent[value="-1"]::before { content: "Decrease Indent"; }
                .ql-indent[value="+1"]::before { content: "Increase Indent"; }
                .ql-link::before { content: "Insert Link"; }
                .ql-image::before { content: "Insert Image"; }
                .ql-video::before { content: "Insert Video"; }
                .ql-clean::before { content: "Clear Formatting"; }
                
                .ql-toolbar button::before {
                    position: absolute;
                    background: #333;
                    color: #fff;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    z-index: 10;
                }
                
                .ql-toolbar button:hover::before {
                    opacity: 1;
                }
                
                .ql-toolbar {
                    position: relative;
                }
                
                .ql-toolbar button {
                    position: relative;
                }
            `}</style>
        </div>
    );
};

export default NotifySubscribers;

