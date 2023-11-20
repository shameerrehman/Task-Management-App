import pytest

from project_management import create_projects
from project_management.create_projects import generate_project_key


def test_generate_project_key_single_word(mocker):
    mocker.patch('project_management.create_projects.disemvowel')
    generate_project_key("few")
    create_projects.disemvowel.assert_called_once()


def test_generate_project_key_multiple_words(mocker):
    mocker.patch('project_management.create_projects.acronymize')
    generate_project_key("The multiple word project")
    create_projects.acronymize.assert_called_once()


def test_generate_project_key_longer_than_four_characters():
    project_key = create_projects.generate_project_key("The Deep End Is Further Than You Think")
    assert project_key == "TDEI"


def test_disemvowel():
    project_key = create_projects.disemvowel("Spediel")
    assert project_key == "SPDL"


def test_acronymize():
    project_key = create_projects.acronymize("The Deep End")
    assert project_key == "TDE"
