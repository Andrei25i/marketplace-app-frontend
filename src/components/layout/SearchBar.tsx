import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Form
      onSubmit={handleSearch}
      style={{ flexGrow: 1, maxWidth: "500px", margin: "0 24px" }}
    >
      <TextInput
        placeholder="Caută anunțuri..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        radius="md"
        rightSection={
          <ActionIcon
            type="submit"
            radius="md"
            color="primary"
            variant="subtle"
          >
            <IconSearch size={18} />
          </ActionIcon>
        }
      />
    </Form>
  );
};

export default SearchBar;
