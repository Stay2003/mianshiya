import { Tag } from "antd"
import type React from "react"
import "./index.css"

interface Props {
  tagList?: string[]
}

const TagList: React.FC<Props> = ({ tagList }) => {
  if (!tagList || tagList.length === 0) {
    return null
  }

  return (
      <div className="tag-list">
        {tagList.map((tag) => {
          return <Tag key={tag}>{tag}</Tag>
        })}
      </div>
  )
}

export default TagList

