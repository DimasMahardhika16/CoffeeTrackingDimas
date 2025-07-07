import ReactDom from "react-dom";

export default function Modal(props) {
  const { children, handleCloseModal } = props;

  return ReactDom.createPortal(
    <div className="modal-container">
      <button onClick={handleCloseModal} className="modal-underlay" />
      <div className="modal-content border-3 flex flex-col items-start w-100">
        {children}
      </div>
    </div>,
    document.getElementById("portal")
  );
}
