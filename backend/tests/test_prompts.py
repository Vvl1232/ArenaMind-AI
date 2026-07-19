from app.core.prompts import (SYSTEM_PROMPT, build_accessibility_prompt,
                              build_assistant_prompt, build_navigation_prompt,
                              build_operations_prompt, build_transport_prompt)


def test_system_prompt_contains_safety_rules():
    assert "STRICT HALLUCINATION PREVENTION" in SYSTEM_PROMPT
    assert "Anti-Injection" in SYSTEM_PROMPT
    assert "contact security immediately" in SYSTEM_PROMPT


def test_build_assistant_prompt():
    prompt = build_assistant_prompt(
        "where is food?", '{"stadium": "data"}', '{"crowd": "data"}'
    )
    assert "where is food?" in prompt
    assert '{"stadium": "data"}' in prompt
    assert '{"crowd": "data"}' in prompt
    assert "STRICT HALLUCINATION PREVENTION" in prompt


def test_build_operations_prompt():
    prompt = build_operations_prompt("fire at gate a", "s_data", "c_data")
    assert "fire at gate a" in prompt
    assert "Operations Copilot Mode" in prompt
    assert "s_data" in prompt
    assert "c_data" in prompt


def test_build_navigation_prompt():
    prompt_normal = build_navigation_prompt("A", "B", "s", "c", accessible=False)
    assert "Navigation Mode" in prompt_normal
    assert "wheelchair-friendly" not in prompt_normal

    prompt_accessible = build_navigation_prompt("A", "B", "s", "c", accessible=True)
    assert "accessible route" in prompt_accessible
    assert "wheelchair-friendly" in prompt_accessible


def test_build_transport_prompt():
    prompt = build_transport_prompt("how to get home", "t_data")
    assert "Transport Advisory Mode" in prompt
    assert "t_data" in prompt
    assert "how to get home" in prompt


def test_build_accessibility_prompt():
    prompt = build_accessibility_prompt("wheelchair ramp", "s_data")
    assert "Accessibility Support Mode" in prompt
    assert "s_data" in prompt
    assert "wheelchair ramp" in prompt
