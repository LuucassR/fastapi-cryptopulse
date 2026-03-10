from sqlalchemy import select
from sqlalchemy.orm import Session
from .models import UserTable


def get_user_by_id(session: Session, id: int):
    user = session.get(UserTable, id)
    if user:
        return user
    return False


def get_user_by_identifier(db: Session, identifier: str):
    # Busca si el identificador coincide con el username O con el email
    return (
        db.query(UserTable)
        .filter((UserTable.username == identifier) | (UserTable.email == identifier))
        .first()
    )


def create_user(
    session: Session, full_name: str, username: str, email: str, password: str
):
    new_user = UserTable(
        full_name=full_name, username=username, email=email, password=password
    )

    session.add(new_user)

    session.commit()

    session.refresh(new_user)

    return new_user


def remove_user(session: Session, id: int):
    user = session.get(UserTable, id)

    if user:
        session.delete(user)
        session.commit()

        return True
    return False

    