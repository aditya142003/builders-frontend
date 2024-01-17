import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

import VideoRecorderButton from "./VideoRecordButton";

const Home = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  const [editData, setEditData] = useState(false);
  const [selectedData, setSelectedData] = useState("");

  const [Services, setServices] = useState("");
  const [Type, setType] = useState("");
  const [CompAddress, setCompAddress] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Reviewed, setReviewed] = useState(null);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [count, setCount] = useState(0);
  const [toReviewCount, setToReviewCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // const [imageUrl, setImageUrl] = useState("");

  const [image, setImage] = useState(null);
  // const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelected = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", type === "image" ? "images" : "videos");
    try {
      let cloudName = "dscmtg4tx";
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      // console.log(res);
      const { secure_url } = res.data;
      // console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = new FormData();
      data.append("file", image);
      //upload image
      let imageUrl;
      if (image.type.split("/")[0] == "image") {
        imageUrl = await uploadFile("image");
        data.append("imageUrl", JSON.stringify(imageUrl));
        data.append("type", JSON.stringify(image.type.split("/")[0]));
        await axios.post(`${process.env.REACT_APP_SERVER}/api/videos`, data);
      } else if (image.type.split("/")[0] == "video") {
        imageUrl = await uploadFile("video");
        data.append("imageUrl", JSON.stringify(imageUrl));
        data.append("type", JSON.stringify(image.type.split("/")[0]));
        await axios.post(`${process.env.REACT_APP_SERVER}/api/bigVideos`, data);
      }

      getData();
      //reset states
      setImage(null);

      console.log("File uploaded successfully");

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/videos`)
      .then((response) => {
        setResults(response.data);
        setCount(response.data.length);
        let c = 0;
        let u = 0;
        response.data.map((e) => {
          if (!e.reviewed) {
            c++;
          }
          if (e.updated) {
            u++;
          }
        });
        setToReviewCount(c);
        let acc = Math.round(
          ((response.data.length - u) / response.data.length) * 100
        );
        setAccuracy(acc);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // for formating the date which is understandable for the user
  const formatDate = (timestamp) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  /** 
  ==========================
    delete code - START
  ========================
   */

  const deleteData = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER}/api/videos/${id}`,
      {
        method: "DELETE",
      }
    );
    getData();
    if (response.status === 200) {
      toast.success("Deleted Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  /** 
  ==========================
    delete code - END
  ========================
   */

  /** 
  ==========================
    update code - START
  ========================
   */
  const updateData = async (id) => {
    //to maintain the existing data if one field updated
    const existingDataResponse = await fetch(
      `${process.env.REACT_APP_SERVER}/api/videos/${id}`
    );
    const existingData = await existingDataResponse.json();
    let updated = false;
    console.log(Services, Type, CompAddress, Mobile, Name, Email);
    if (Services || Type || CompAddress || Mobile || Name || Email) {
      updated = true;
    }
    const response = await fetch(
      `${process.env.REACT_APP_SERVER}/api/videos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          imageUrl: image || existingData.imageUrl,
          Services: Services || existingData.Services,
          Type: Type || existingData.Type,
          CompAddress: CompAddress || existingData.CompAddress,
          Mobile: Mobile || existingData.Mobile,
          Name: Name || existingData.Name,
          Email: Email || existingData.Email,
          Reviewed: Reviewed === null ? existingData.Reviewed : Reviewed,
          updated: updated,
        }),
      }
    );
    getData();
    setServices("");
    setType("");
    setCompAddress("");
    setMobile("");
    setName("");
    setEmail("");
    if (response.status === 200) {
      toast.success("Data updated Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  /** 
  ==========================
    update code - END
  ========================
   */

  return (
    <>
      {/* toaster */}
      <Toaster position="top-center" reverseOrder={false} />
      {/* toaster */}

      <div className="input-file">
        <div>
          <img src="https://i.ibb.co/tmwqkpj/logo.png" alt="website-logo" />
        </div>
        <div className="card1">
          <h1>Total Signages</h1>
          <h1>{count}</h1>
        </div>

        <div className="card2">
          <h1>To be revised</h1>
          <h1>{toReviewCount}</h1>
        </div>

        <div className="card3">
          <h1>Accuracy</h1>
          <h1>{accuracy}%</h1>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div>
            <input
              type="file"
              id="fileInput"
              required
              onChange={handleSelected}
            />
            <label
              for="fileInput"
              class="custom-file-label"
              style={{ textAlign: "center" }}
            >
              {image ? image.name : "Choose a File"}
            </label>
          </div>

          <div>
            <button className="upload-button" type="submit">
              Upload
            </button>
          </div>
          <div>
            <button onClick={() => navigate("/VideoRecordButton")}>
              Record video
            </button>
          </div>
          {loading && (
            <ColorRing
              visible={true}
              height="30"
              width="30"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
        </form>
      </div>

      <div className="bg2">
        <div>
          <input id="checkbox" type="checkbox" />
          <label htmlFor="checkbox">show only remainig to be revised</label>
        </div>

        <div className="flexDelete">
          <div>
            <button className="delete-filter">Delete filtered data</button>
          </div>
          <div>
            <button className="getStarted">Get street address</button>
          </div>

          <div className="cardBg-white">
            <p>SEARCH(BY LOCATION,DATE,KEYWORDS,DETAILS...)</p>
            <div>
              <input
                className="searchBar"
                type="search"
                placeholder="Search..."
                id="search"
              />
              <label htmlfor="search">
                <button className="search" type="button">
                  Search
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="table-data-container">
        {/* 
            ===================================
                Table Code  - START
            ===================================
        */}

        <table className="tablestyle">
          <thead>
            <tr>
              <th>Reviewed?</th>
              <th></th>
              <th className="th1">Type</th>
              <th>Date / Timestamp</th>
              <th>Spotted at Location</th>
              <th>Company Details</th>
              <th>Services</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td className="delete-edit">
                  <div>
                    {result.reviewed ? (
                      <button
                        className="btn-yes"
                        style={{ backgroundColor: "green" }}
                      >
                        Yes
                      </button>
                    ) : (
                      <button
                        className="btn-no"
                        style={{ backgroundColor: "orange" }}
                      >
                        No
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditData(!editData);
                        setSelectedData(result._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-edit"
                      style={{ backgroundColor: "red" }}
                      onClick={() => deleteData(result._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>

                <td>
                  {result.imageUrl ? (
                    <img
                      className="table-data-image"
                      src={result.imageUrl} // Assuming your API response has an imageUrl property
                      alt=""
                    />
                  ) : (
                    <video
                      width="300"
                      height="auto"
                      controls="controls"
                      src={result.videoUrl} // Assuming your API response has an imageUrl property
                      alt=""
                    />
                  )}
                </td>
                <td
                  contentEditable={editData}
                  onInput={(e) => setType(e.target.innerText)}
                >
                  {result.Type}
                </td>
                <td>
                  <div>{formatDate(result.createdAt).split("at")[0]}</div>
                  <div style={{ color: "blue", fontSize: "13px" }}>
                    {formatDate(result.createdAt).split("at")[1]}
                  </div>
                </td>
                <td>
                  {result?.address ? (
                    result.address
                  ) : (
                    <div style={{ opacity: ".5" }}>
                      Street Address Not Fetched
                    </div>
                  )}
                  {result?.latitude && result?.longitude ? (
                    <div
                      style={{
                        display: "flex",
                        color: "blue",
                        margin: "auto",
                        width: "150px",
                      }}
                    >
                      <div>{result?.latitude}</div>
                      <div>, &nbsp;&nbsp;&nbsp;</div>
                      <div>{result?.longitude}</div>
                    </div>
                  ) : (
                    <></>
                  )}
                </td>
                <td>
                  <div
                    contentEditable={editData}
                    onInput={(e) => setName(e.target.innerText)}
                  >
                    {result.Name != "null" ? (
                      <>{result.Name}</>
                    ) : (
                      <>&lt;name&gt;</>
                    )}
                  </div>
                  <br></br>
                  <div
                    contentEditable={editData}
                    onInput={(e) => setMobile(e.target.innerText)}
                  >
                    {result.Mobile != "null" ? (
                      <>{result.Mobile}</>
                    ) : (
                      <>&lt;contact&gt;</>
                    )}
                  </div>
                  <br></br>
                  <div
                    contentEditable={editData}
                    onInput={(e) => setCompAddress(e.target.innerText)}
                  >
                    {result.CompAddress != "null" ? (
                      <>{result.CompAddress}</>
                    ) : (
                      <>&lt;address&gt;</>
                    )}
                  </div>
                  <br></br>
                  <div
                    contentEditable={editData}
                    onInput={(e) => setEmail(e.target.innerText)}
                  >
                    {result.Website != "null" ? (
                      <>{result.Website}</>
                    ) : (
                      <>&lt;website&gt;</>
                    )}
                  </div>
                </td>
                <td
                  contentEditable={editData}
                  onInput={(e) => setServices(e.target.innerText)}
                >
                  {result.Services}
                </td>

                {result.reviewed ? (
                  <button
                    className={`${
                      selectedData === result._id && editData
                        ? "block"
                        : "hidden"
                    }
                  `}
                    style={{ backgroundColor: "red" }}
                    onClick={() => setReviewed(false)}
                  >
                    Unreview
                  </button>
                ) : (
                  <button
                    className={`${
                      selectedData === result._id && editData
                        ? "block"
                        : "hidden"
                    }
                  `}
                    onClick={() => setReviewed(true)}
                  >
                    Review
                  </button>
                )}
                <button
                  className={`${
                    selectedData === result._id && editData ? "block" : "hidden"
                  }
                  `}
                  onClick={() => {
                    updateData(result._id);
                    setEditData(false);
                  }}
                >
                  Save
                </button>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 
            ===================================
                Table Code  - END
            ===================================
        */}

        <div className="bottom-flex">
          <div className="bottom-box">
            <div>
              <inpt type="checkbox" />
              <p>show only remainig to be reviewed</p>
            </div>
          </div>

          <div>
            <button type="button">Search</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
