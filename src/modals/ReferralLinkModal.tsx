import { FC, useState, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";

import { MODAL_REFERRAL, MODAL_INFO } from "../routes";
import { getDispatchObject, SET_TASKS, SET_TOAST } from "../store/reducer";
import useModal from "../hooks/useModal";
import { fetchData } from "../utils/api";
import iconLogo from "../assets/images/coins/normal.png";

const ReferralLinkModal: FC = () => {
  const { activeModal, setActiveModal, activeModalParams } = useModal();
  const selector: any = useSelector((s) => s);
  const isAmbassador = selector['isAmbassador'];

  const dispatch = useDispatch();

  const [taskInput, setTaskInput] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTaskInput(activeModalParams?.link || "");
  }, [activeModalParams]);

  const updateReferralLink = async (onClose: () => void) => {
    setLoading(true);

    // Sleep to discurage trying by bruteforce
    await new Promise((r) => setTimeout(r, 3000));

    if (taskInput === "") {
      dispatch(
        getDispatchObject("SET_TOAST", {
          open: true,
          message: "Invalid code",
          type: "error",
        })
      );
      setLoading(false);
      return;
    }

    if (!isAmbassador) {
      dispatch(
        getDispatchObject("SET_TOAST", {
          open: true,
          message: "You don't have permission",
          type: "error",
        })
      );
      setLoading(false);
      return;
    }

    const response = await fetchData("/tasks/updateReferralLink", {
      id: activeModalParams["supertask_id"],
      taskid: activeModalParams["id"],
      input: taskInput,
    });

    if (response.error || response.result !== "ok") {
      dispatch(
        getDispatchObject(SET_TOAST, {
          open: true,
          message: response.error || "Task not completed",
          type: "error",
        })
      );
      setLoading(false);
      return;
    }

    setLoading(false);

    setActiveModal(MODAL_INFO, {
      icon: iconLogo,
      title: "You have updated",
      buttonText: "Thank you 🥳",
      description: () => (
        <p>
          referral link !
        </p>
      ),
    });
    fetchCampaigns();
  };

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await fetchData('/tasks/get')

      const tasks = response.result.tasks
      let sections = response.result.sections
      const superTasks = response.result.superTasks

      sections = sections.map((section: any) => ({
        ...section,
        steps: tasks.filter(
          (task: any) => task.section_id === section.id
        ),
      }))

      const independentTasks = tasks.filter(
        (task: any) => !task.supertask_id
      )

      const superTasksWithSteps = superTasks
        .map((superTask: any) => ({
          ...superTask,
          type: 'supertask',
          sections: sections.filter(
            (section: any) => section.supertask_id === superTask.id
          ),
          steps: tasks.filter(
            (task: any) =>
              task.supertask_id === superTask.id &&
              (task?.section_id == null ||
                task?.section_id == '' ||
                task?.section_id == undefined)
          ),
        }))
        .sort((a: any, b: any) => a.orderpriority - b.orderpriority)

      const allCampaigns = [
        ...superTasksWithSteps,
        ...independentTasks.map((task: any) => ({
          ...task,
          type: 'task',
        })),
      ]

      dispatch(getDispatchObject(SET_TASKS, allCampaigns))
    } catch (e: any) {
      console.log(e)
    }
  }, [dispatch])

  return (
    <>
      <Modal
        isOpen={activeModal === MODAL_REFERRAL}
        placement="center"
        onClose={() => setActiveModal(null)}
      >
        <ModalContent className={"bg-gray-800"}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                UPLOAD YOUR REFERRAL LINK
              </ModalHeader>
              <ModalBody className={"referral_body"}>
                <p className="text-16-medium mb-0 mt-0">
                  {activeModalParams.description}
                </p>
                <Input
                  classNames={{
                    inputWrapper: "main-input",
                  }}
                  size="md"
                  value={taskInput}
                  placeholder={`Link (format: ${activeModalParams?.additional_info?.refer_link_type || 'https://bingx.com/invite?id=[]'})`}
                  type="text"
                  onChange={(event: any) => setTaskInput(event.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <div style={{ display: "block", width: "100%" }}>
                  <Button
                    size="lg"
                    fullWidth
                    style={{ backgroundColor: "#3b82f6" }}
                    className={"text-white"}
                    isLoading={isLoading}
                    onClick={() => updateReferralLink(onClose)}
                  >
                    Update
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReferralLinkModal;
