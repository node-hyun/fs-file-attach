import React, {
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useDropzone } from "react-dropzone";
// import Modal from "./common/Modal";
import axios from "axios";
import "./FileAttachUpload.scss";

const styles = {
  fontFamily: "sasns-serif",
  textAlign: "center",
};
const maxLength = 150;

function FileAttachUpload(props) {
  const [indexesArrayForCheckedList, setIndexesArrayForCHeckedList] = useState(
    []
  );
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [allCheckBoxStatus, setAllCheckBoxStatus] = useState([]);
  const [countForJeneralFiles, setCountForJeneralFiles] = useState(0);
  const [countForBigFiles, setCountForBigFiles] = useState(0);
  const [dropzoneOpened1, setDropzoneOpened] = useState(true);
  const [dropzoneOpened2, setDropzoneOpened2] = useState(true);

  // 용량 관련
  // 일반 용량 합계 (단순 표시)
  const [totalOfJeneralFileSize, setTotalOfJeneralFileSize] = useState(0);
  const [totalOfBifFileSize, setTotalOfBigFileSize] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 대용량 파일 업로드 권한 여부
  const [authorityForBigSizeFileUpload, setAuthorityForBigSizeFileUpload] =
    useState(true);

  // 프로그래스바 관련
  const [percent, setPercent] = useState(0);

  function fileAttachValidator(file) {
    // if (file.name.length > maxLength) {
    //   alert("파일 이름의 길이는 150자를 넘을수 없다");
    // }
    // return {
    //   code: "name-too-large",
    //   message: `Name is larget than ${maxLength} characters`,
    // };
    // const fileNamesToUpload = filesToUpload.map((el) => el.name);
    // if (fileNamesToUpload.includes(file.name)) {
    //   alert("중복 파일 업로드는 제한 됩니다");
    // }
    // return {
    //   code: "name-too-large",
    //   message: `Name is larget than ${maxLength} characters`,
    // };
    // return null;
  }

  const deleteForCHeckedRow = () => {
    console.log("체크 로우 삭제 버튼 클릭");

    let countForJeneralTypeFiles = 0;
    let countForBigTypeFiles = 0;

    console.log("indexesArrayForCheckedList : ", indexesArrayForCheckedList);

    const update = filesToUpload.filter((file) => {
      if (!indexesArrayForCheckedList.includes(file.index)) {
        return file;
      } else {
        if (file.size_type === "jeneral") {
          console.log("일반 타입");
          countForJeneralTypeFiles++;
          setTotalOfJeneralFileSize((prev) => prev - file.size);
        } else {
          console.log("빅 타입일 경우");
          countForBigTypeFiles++;
          setTotalOfBigFileSize((prev) => prev - file.size);
        }
      }
    });
    setCountForJeneralFiles((prev) => prev - countForJeneralTypeFiles);
    setCountForBigFiles((prev) => prev - countForBigTypeFiles);
    setFilesToUpload(update);
    setIndexesArrayForCHeckedList([]);
    setAllCheckBoxStatus(false);
  };

  const allCheckHandeling = (e) => {
    const checked = e.target.checked;
    console.log(checked);

    if (checked) {
      console.log("채워");
      setAllCheckBoxStatus(true);
      const indexArrayForFiles = filesToUpload.map((el) => {
        return el.index;
      });
      console.log("인덱스 확인 :", indexArrayForFiles);
      setIndexesArrayForCHeckedList(indexArrayForFiles);
    } else {
      console.log("비워");
      setAllCheckBoxStatus(false);
      setIndexesArrayForCHeckedList([]);
    }
  };

  const moveRowUp = (paramse) => {
    console.log("indexesArrayForCheckedList : ", indexesArrayForCheckedList);
  };

  const moveRowown = (params) => {
    console.log("indexesArrayForCheckedList : ", indexesArrayForCheckedList);
  };

  const toggleDropzone1 = () => {
    setDropzoneOpened(!dropzoneOpened1);
  };

  const toggleDropzone2 = () => {
    setDropzoneOpened(!dropzoneOpened1);
    setDropzoneOpened2(!dropzoneOpened2);
  };

  const confirmChecked = useCallback(
    (index) => setIndexesArrayForCHeckedList.includes(index),
    [indexesArrayForCheckedList]
  );

  const handleCheckedStatus = useCallback(
    (e, idx) => {
      console.log("e.target : ", e.target);
      console.log("e.target.checked : ", e.target.checked);
      console.log("idex : ", idx);
      const checked = e.target.checked;

      if (!checked) {
        const indexArrayForUpdate = indexesArrayForCheckedList.filter((el) => {
          console.log("체크 상태 풀기 위해 index 제거");
          return el !== idx;
        });
        setIndexesArrayForCHeckedList(indexArrayForUpdate);
      } else {
        console.log("체크 상태로 만들기 위해 idnex 추가");
        setIndexesArrayForCHeckedList((prev) => [...prev, idx]);
      }
    },
    [indexesArrayForCheckedList]
  );

  const deleteOneRowByIndex = useCallback(
    (idx) => {
      console.log("idx : ", idx);
      const afterDeleteRow = filesToUpload.filter((file) => {
        return file.index !== idx;
      });
      setFilesToUpload(afterDeleteRow);

      const updateIndexArrayForCheckedList = indexesArrayForCheckedList.filter(
        (index) => {
          return index !== idx;
        }
      );
      if (filesToUpload[idx].size_type === "jeneral") {
        setCountForJeneralFiles((prev) => prev - 1);
        setTotalOfJeneralFileSize((prev) => prev - filesToUpload[idx].size);
      } else {
        setCountForBigFiles((prev) => prev - 1);
        setTotalOfBigFileSize((prev) => prev - filesToUpload[idx].size);
      }

      setIndexesArrayForCHeckedList(updateIndexArrayForCheckedList);
    },
    [filesToUpload]
  );

  const handleOpenModal = () => {
    console.log("모달 오픈 클릭");
    setIsOpen((prev) => !prev);
  };

  const toggleFileSizeType = useCallback(
    (idx) => {
      console.log("aa : ", idx);

      if (filesToUpload[idx].size_type === "jeneral") {
        setFilesToUpload(
          filesToUpload.map((item) =>
            item.index === idx ? { ...item, size_type: "big" } : item
          )
        );
        console.log("bb : ", filesToUpload[idx].size_type);
        setTotalOfJeneralFileSize((prev) => prev - filesToUpload[idx].size);
        setTotalOfBigFileSize((prev) => prev + filesToUpload[idx].size);
        setCountForJeneralFiles((prev) => prev - 1);
        setCountForBigFiles((prev) => prev + 1);
      } else {
        setFilesToUpload(
          filesToUpload.map((item) =>
            item.index === idx ? { ...item, size_type: "jeneral" } : item
          )
        );
        setTotalOfBigFileSize((prev) => prev - filesToUpload[idx].size);
        setTotalOfJeneralFileSize((prev) => prev + filesToUpload[idx].size);
        setCountForJeneralFiles((prev) => prev + 1);
        setCountForBigFiles((prev) => prev - 1);
        console.log("dd : ", filesToUpload[idx].size_type);
      }
    },
    [filesToUpload]
  );

  const onDrop = useCallback(
    async acceptedFiles => {
      console.log("onDrop 실행 acceptedFiles 확인 :", acceptedFiles);
      console.log("acceptedFiles : ", acceptedFiles);
      const filesArrayForUpdate = acceptedFiles.map((file, index) => {
        let file_name = file.name;
        // file_name = file_name.replacce(/\\/g, "_");

        return {
          index: filesToUpload.length + index,
          name: file.name,
          size: file.sizem,
          size_type: "jeneral",
        };
      });

      // setFilesToUpload([{name : "hyun", size:100}])

      setFilesToUpload((prev) => [...prev, ...filesArrayForUpdate]);
      setCountForJeneralFiles((prev) => prev + acceptedFiles.length);

      const getSum = (total, el) => {
        return total + Math.round(el.size);
      };

      const totialOfJeneralSizeFiles = acceptedFiles.reduce(getSum, 0);
      console.log("totalOFjeneralSizeFilees : ", totialOfJeneralSizeFiles);

      // 파일 업로드 요청 날리기
      const fileFormData = new FormData();
      [].forEach.call(acceptedFiles, (f) => {
        fileFormData.append("fileData", f);
      });
      console.log("formData : ", fileFormData);

      // try {
      //   const res = await axios.post("http://localhost:5000/files/", fileFormData, {
      //     headers: { "Context-Type": "multi/form-data" },
      //     onUploadProgress: (e) => {
      //       setPercent(Math.round((100 * e.loaded) / e.total));
      //     },
      //   });
      //   alert("파일 업로드 성공 !!");
      //   console.log({ res });
      // } catch (err) {
      //   console.log("에러 발생");
      //   console.log("err : ", err.response.data.message);
      // }
    },
    [filesToUpload]
  );

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    onDrop,
    noDragEventsBubbling: true,
    validator: fileAttachValidator,
    maxSize: authorityForBigSizeFileUpload ? 52528800 : 2147483648,
  });

  let baseStyle = {
    width: "100%",
    color: "#111",
    height: "auto",
    minHeight: "50px",
    textAlign: "center",
    backgroundColor: "lightgrey",
  };

  const activeStyle = {
    height: filesToUpload.length == 0 && "65px",
  };

  const acceptStyle = {};
  const rejectStyle = {};
  const maxLength = 150;

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const files = filesToUpload.map((file) => (
    <div className="fileRow" key={file.index}>
      <div>
        <input
          type="checkbox"
          id={file.index}
          onClick={(e) => handleCheckedStatus(e, file.index)}
          defaultChecked={false}
        />
      </div>
      <div>
        {file.name} &nbsp; {file.size} (bytes)
      </div>
      <div>
        {authorityForBigSizeFileUpload ? (
          <span>
            <span>
              {file.size_type === "jeneral" ? "일반" : "대용량"}
              &nbsp;
              <button
                type="button"
                onClick={() => toggleFileSizeType(file.index)}
              >
                전환
              </button>
            </span>
          </span>
        ) : (
          ""
        )}
      </div>

      <div>
        <button
          className="fileRowButton"
          type="button"
          onClick={() => deleteOneRowByIndex(file.index)}
        >
          삭제
        </button>
      </div>
    </div>
  ));

  return (
    <div className="">
      {dropzoneOpened2 ? (
        <div>
          <div className="headers">
            <div>
              <button onClick={open}>pc2</button>
              <button onClick={open}>문서 관리2</button>
              <button onClick={open}>EDM</button>
              <button onClick={open}>DRM</button>
            </div>
            <div>
              일반 <b> {countForJeneralFiles}</b> ({totalOfJeneralFileSize})
              KB/10.00 MB)&nbsp; 대용량 <b>{countForBigFiles}</b> (
              {totalOfBifFileSize}) KB/2.00GB)
            </div>

            {dropzoneOpened1 ? (
              <div>
                {filesToUpload.length !== 0 ? (
                  <button onClick={toggleDropzone1}>닫기</button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {dropzoneOpened1 ? (
      <div {...getRootProps({className: 'dropzone'})}>
      <input {...getInputProps()} />
          {filesToUpload !== 0 ? (
            <div>
              <div className="fileRowHeader">
                {isDragActive && (
                  <p className="file_hover_message">
                    {" "}
                    첨부할 파일을 여기에 놓아주세요{" "}
                  </p>
                )}
                <input
                  type="checkbox"
                  onClick={allCheckHandeling}
                  checked={allCheckBoxStatus}
                />
                <div>
                  <button>올리기</button>
                  <button>내리기</button>
                  <button onClick={deleteForCHeckedRow}>삭제</button> | 총{" "}
                  {filesToUpload.length}
                </div>
                <div>
                  {authorityForBigSizeFileUpload ? (
                    <span
                      className="bigSizeFileOption"
                      onClick={handleOpenModal}
                    >
                      대용량 첨부 설정
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="fileRowWrapper">{files}</div>
            </div>
          ) : (
            <div style={{ paddingTop: "12px" }}>
              <span className="messageForFileDropMethod">
                첨부할 파일을 여기에 놓아주세요
              </span>
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      <div className="closeDropzoneButton">
        {dropzoneOpened2 ? (
          <button onClick={toggleDropzone2}>닫기</button>
        ) : (
          <button onClick={toggleDropzone2}>열기</button>
        )}
      </div>
    </div>
  );
} // 컴퍼넌트 끝

export default FileAttachUpload;
