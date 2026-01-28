import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";

const Dashboard = () => {
  const [uploadFiletext, setUploadFileText] = useState("Upload Your Resume");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");

  const [result, setResult] = useState(null);

  const { userInfo } = useContext(AuthContext);

  const handleOnChangeFile = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadFileText(e.target.files[0].name);
  };

  const handleUpload = async () => {
    setResult(null);
    if (!jobDesc || !resumeFile) {
      alert("Please fill Job Description & Upload Resume");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_desc", jobDesc);
    formData.append("user", userInfo._id);
    setLoading(true);
    try {
      const result = await axios.post("/api/resume/addResume", formData);
      setResult(result.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Dashboard}>
      <div className={styles.DashboardLeft}>
        <div className={styles.DashboardHeader}>
          <div className={styles.DashboardHeaderTitle}>
            Smart AI Job Tracker
          </div>
          <div className={styles.DashboardHeaderLargeTitle}>
            Resume Match Score
          </div>
        </div>
        <div className={styles.alertInfo}>
          <div>🔔 Important Instructions:</div>
          <div className={styles.dashboardInstruction}>
            <div>
              📋 Please paste the complete job description in the "Job
              Description" field before submitting.
            </div>
            <div>📎 Only PDF format (.pdf) resumes are accepted. </div>
          </div>
        </div>

        <div className={styles.DashboardUploadResume}>
          <div className={styles.DashboardResumeBlock}>{uploadFiletext}</div>
          <div className={styles.DashboardInputField}>
            <label htmlFor="inputField" className={styles.analyzeAIBtn}>
              Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf"
              id="inputField"
              onChange={handleOnChangeFile}
            />
          </div>
        </div>

        <div className={styles.jobDesc}>
          <textarea
            value={jobDesc}
            onChange={(e) => {
              setJobDesc(e.target.value);
            }}
            className={styles.textarea}
            placeholder="Paste Your Job Description"
            rows={10}
            cols={50}
          />

          <div className={styles.AnalyzeBtn} onClick={handleUpload}>
            Analyze
          </div>
        </div>
      </div>

      <div className={styles.DashboardRight}>
        <div className={styles.DashboardRightTopCard}>
          <div style={{ fontSize: 25 }}>Analyze With AI</div>

          <img className={styles.profileImg} src={userInfo?.photoUrl} />
          <h2>{userInfo?.name}</h2>
        </div>

        {result && (
          <div className={styles.DashboardRightTopCard}>
            <div style={{ fontSize: 25 }}>Result</div>

            <div
              className={styles.progressRing}
              style={{ "--score": result?.score }}
            >
              <span className={styles.progressValue}>{result?.score}%</span>
            </div>

            <div className={styles.feedback}>
              <h3>Feedback</h3>
              <p>{result?.feedback}</p>
            </div>
          </div>
        )}

        {/* {result && (
          <div className={styles.DashboardRightTopCard}>
            <div>Result</div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20",
              }}
            >
              <h1>{result?.score}%</h1>
              <CreditScoreIcon sx={{ fontSize: 22, paddingLeft: 2 }} />
            </div>
            <div className={styles.feedback}>
              <h3>Feedback</h3>
              <p>{result?.feedback}</p>
            </div>
          </div>
        )} */}
        {loading && (
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: "20px" }}
            width={280}
            height={280}
          />
        )}
      </div>
    </div>
  );
};

export default withAuthHOC(Dashboard);
