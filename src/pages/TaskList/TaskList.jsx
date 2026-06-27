import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { tasksAPI } from "../../services/api";
import FilterBar from "../../components/FilterBar/FilterBar";
import TaskCard from "../../components/TaskCard/TaskCard";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import EmptyState from "../../components/EmptyState/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/helpers";
import "./TaskList.css";

export default function TaskList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Sync state when URL params change (sidebar filter clicks) ──
  useEffect(() => {
    setStatus(searchParams.get("status") || "");
    setPriority(searchParams.get("priority") || "");
  }, [searchParams]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      const res = await tasksAPI.getAll(params);
      setTasks(res.data.results || res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, status, priority]);

  useEffect(() => {
    const t = setTimeout(loadTasks, 300);
    return () => clearTimeout(t);
  }, [loadTasks]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await tasksAPI.delete(deleteTarget.id);
      toast.success("Task deleted");
      setDeleteTarget(null);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTasks(reordered);
    try {
      await tasksAPI.reorder(reordered.map((t) => t.id));
    } catch {
      toast.error("Reorder failed");
      loadTasks();
    }
  };

  const handleStatusChange = (v) => {
    setStatus(v);
    setSearchParams((p) => {
      const n = new URLSearchParams(p);
      v ? n.set("status", v) : n.delete("status");
      return n;
    });
  };

  const handlePriorityChange = (v) => {
    setPriority(v);
    setSearchParams((p) => {
      const n = new URLSearchParams(p);
      v ? n.set("priority", v) : n.delete("priority");
      return n;
    });
  };

  const isFiltered = !!(search || status || priority);

  const pageTitle = status
    ? status === "todo" ? "To Do Tasks"
    : status === "inprogress" ? "In Progress Tasks"
    : "Completed Tasks"
    : "All Tasks";

  return (
    <div className="task-list-page animate-fadeIn">
      <div className="task-list-page__header">
        <div>
          <h1 className="task-list-page__title">{pageTitle}</h1>
          <p className="task-list-page__count">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            {isFiltered ? " matching filters" : " total"}
          </p>
        </div>
      </div>

      <div className="task-list-page__filters">
        <FilterBar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={handleStatusChange}
          priority={priority}
          onPriority={handlePriorityChange}
        />
      </div>

      {loading ? (
        <div className="task-list-page__loading">
          <LoadingSpinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState filtered={isFiltered} />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                className="task-list-page__list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <TaskCard
                        task={task}
                        onDelete={setDeleteTarget}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <DeleteModal
        task={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}