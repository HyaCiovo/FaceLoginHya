import { JSX, splitProps } from "solid-js";

const Modal = (props: { children: string | JSX.Element, onClose?: () => void, ref?: any }) => {
  const [local, others] = splitProps(props, ["children", "onClose", "ref"]);

  return <dialog id="my_modal_2" class="modal">
    <div class="modal-box">
      {local.children}
    </div>
    <form method="dialog" class="modal-backdrop">
      <button onClick={() => local.onClose && local.onClose()} ref={local.ref}>close</button>
    </form>
  </dialog>
}

export default Modal