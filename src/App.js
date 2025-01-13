import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AdReview from "./ad_review/AdReview";
import { FaUpload } from "react-icons/fa"; // Import the upload icon from react-icons
import { Spinner } from "react-bootstrap"; // If using react-bootstrap

const App = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adType, setAdType] = useState("image");
  const [adContent, setAdContent] = useState("");
  const [adDesc, setAdDesc] = useState("");
  const [ad, setAd] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Track submission loading
  const [result, setResult] = useState({ analysis: null }); // Track submission loading
  useEffect(() => {
    fetch("https://api.example.com/ads", {
      method: "GET",
      headers: {
        authorization: "your token comes here",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAds(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
        setLoading(false);
      });
  }, []);

  const handleAdTypeChange = (e) => {
    setAdType(e.target.value);
  };

  const handleAdContentChange = (e) => {
    setAdContent(e.target.value);
  };
  const handleAdDescChange = (e) => {
    setAdDesc(e.target.value);
  };
  const handleAd = (e) => {
    if (adType != "text") {
      const file = e.target.files[0]; // Get the first file (assuming only one file is uploaded)
      setAd(file); // Store the file object in state
    } else {
      setAd(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    debugger;
    const formData = new FormData();
    if (adType != "text") {
      formData.append(`${adType}_file`, ad, ad.name); // Append the file (the Blob)
    } else {
      debugger;
      formData.append("text", ad);
    }

    fetch(`http://localhost:8000/upload/${adType}`, {
      method: "POST",
      headers: {
        authorization: "your token comes here",
      },
      body: adType == "text" ? { text: ad } : formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        setLoadingSubmit(false);
      })
      .catch((error) => {
        console.error("Error uploading ad:", error);
      });
  };

  return (
    <>
      <header>
        <h1>مدقق اللإمتثال للإعلانات</h1>
      </header>
      <div className="container mt-4">
        <div className="init">
          <div>
            <h2 className="name">المدقق</h2>
            <h1 className="description">
              لمراجعة تطابق الإعلانات مع الجهات المشرعه{" "}
              <span className="underline">بالذكاء الاصطناعي</span>
            </h1>
          </div>
          <div>
            <img src="gif.gif"></img>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="d-flex">
            <div className="col-6">
              <div className="row">
                <div className="form-group col-4 mb-4">
                  <label htmlFor="adType">نوع الإعلان</label>
                  <select
                    id="adType"
                    className="form-select"
                    value={adType}
                    onChange={handleAdTypeChange}
                  >
                    <option value="image">مرئي</option>
                    <option value="text">مكتوب</option>
                    <option value="voice">مسموع</option>
                  </select>
                </div>
                <div className="form-group col-4 mb-4">
                  <label htmlFor="adContent">محتوى الإعلان</label>
                  <select
                    id="adContent"
                    className="form-select"
                    value={adContent}
                    onChange={handleAdContentChange}
                  >
                    <option value="product">منتج</option>
                    <option value="service">خدمة</option>
                    <option value="tv">تلفزيوني</option>
                    <option value="gov">حكومي</option>
                  </select>
                </div>
                <div className="form-group col-8 mb-4">
                  <label htmlFor="adDesc">وصف الإعلان</label>
                  <input
                    id="adDesc"
                    className="form-control"
                    value={adDesc}
                    onChange={handleAdDescChange}
                    type="text"
                  />
                </div>
              </div>
              <div className="form-group mb-4 custom-file-button">
                <label className="d-block" htmlFor="ad">
                  الإعلان
                </label>
                {adType === "text" ? (
                  <textarea
                    id="ad"
                    className="form-control"
                    value={ad}
                    onChange={handleAd}
                    rows="5"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      id="ad"
                      className="custom-file-input"
                      onChange={handleAd}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="ad" className="custom-file-label">
                      <FaUpload height={100} /> {ad.name}
                    </label>
                  </>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Ad
              </button>
            </div>
            <div className="col-6">
              <label>نتيجة المراجعة</label>
              <textarea
                className="form-control result"
                disabled="true"
                value={result.analysis}
              />
            </div>
          </div>
        </form>
        {loadingSubmit ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <div className="row">
            {ads.map((ad) => (
              <div className="col-md-4 mb-4" key={ad.id}>
                <AdReview ad={ad} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
